import { CURRENCY_OPTIONS } from '../constants/currencies';
import { META_ALIAS_LOOKUP, normalizeMetaToken, resolveMetaField } from '../constants/metaColumns';
import { parseSafeFloat, parseSafeInt, generateId, safeNum } from '../utils/safeMath';

export const waitForExternalLibrary = async ({ isReady, scripts, marker, timeoutMs = 12000 }) => {
  if (isReady()) return;

  let lastError = null;
  for (const src of scripts) {
    try {
      await new Promise((resolve, reject) => {
        if (isReady()) { resolve(); return; }

        const selector = `script[data-anareq-lib="${marker}"][src="${src}"]`;
        let script = document.querySelector(selector);
        let settled = false;
        const cleanup = () => {
          clearTimeout(timer);
          script?.removeEventListener('load', handleLoad);
          script?.removeEventListener('error', handleError);
        };
        const finish = (callback, value) => {
          if (settled) return;
          settled = true;
          cleanup();
          callback(value);
        };
        const handleLoad = () => isReady()
          ? finish(resolve)
          : finish(reject, new Error(`Library ${marker} loaded without exposing its global object.`));
        const handleError = () => finish(reject, new Error(`Could not load ${marker} from ${src}`));
        const timer = setTimeout(() => finish(reject, new Error(`Timeout loading ${marker}`)), timeoutMs);

        if (!script) {
          script = document.createElement('script');
          script.dataset.anareqLib = marker;
          script.src = src;
          script.async = true;
          document.head.appendChild(script);
        } else if (isReady()) {
          finish(resolve);
          return;
        }

        script.addEventListener('load', handleLoad, { once: true });
        script.addEventListener('error', handleError, { once: true });

        // Si el script ya terminó de cargar antes de registrar listeners, resolvemos sin quedar colgados.
        setTimeout(() => { if (isReady()) finish(resolve); }, 0);
      });
      if (isReady()) return;
    } catch (error) {
      lastError = error;
      const failedScript = document.querySelector(`script[data-anareq-lib="${marker}"][src="${src}"]`);
      failedScript?.remove();
    }
  }
  throw lastError || new Error(`Unable to load ${marker}`);
};


export const EMPTY_META_IMPORT = {
  status: 'idle', fileName: '', sourceFormat: '', level: 'unknown', currency: '',
  dateRange: { start: '', end: '' }, rows: [], selectedIds: [], detectedColumns: [],
  warnings: [], errors: [], resultTypes: [], importedAt: ''
};

export const isoDateFromLooseValue = (value) => {
  if (!value) return '';
  const raw = String(value).trim();
  if (/^\d{4}-\d{2}-\d{2}/.test(raw)) return raw.slice(0, 10);
  const match = raw.match(/^(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{2,4})$/);
  if (!match) return '';
  const [, d, m, yRaw] = match; const y = yRaw.length === 2 ? `20${yRaw}` : yRaw;
  return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
};
export const detectCurrencyFromRows = (rows = []) => {
  const corpus = rows.map(row => Object.values(row || {}).join(' ')).join(' ');
  if (/R\$|\bBRL\b/i.test(corpus)) return 'BRL'; if (/€|\bEUR\b/i.test(corpus)) return 'EUR';
  if (/COL\$|\bCOP\b/i.test(corpus)) return 'COP'; if (/MX\$|\bMXN\b/i.test(corpus)) return 'MXN';
  if (/AR\$|\bARS\b/i.test(corpus)) return 'ARS'; if (/CLP\$|\bCLP\b/i.test(corpus)) return 'CLP';
  if (/S\/|\bPEN\b/i.test(corpus)) return 'PEN'; return 'USD';
};

export const normalizeImportedMetaRows = (rawRows = []) => {
  const headers = [...new Set(rawRows.flatMap(row => Object.keys(row || {})))];
  const fieldMap = headers.reduce((acc, header) => { const field = resolveMetaField(header); if (field && !acc[field]) acc[field] = header; return acc; }, {});
  const rows = rawRows.map((raw, index) => {
    const read = (field) => raw?.[fieldMap[field]] ?? '';
    return {
      id: `meta-${index}-${generateId()}`, rowNumber: index + 1,
      campaignName: String(read('campaignName') || '').trim(), adSetName: String(read('adSetName') || '').trim(), adName: String(read('adName') || '').trim(),
      spend: Math.max(0, parseSafeFloat(read('spend'))), impressions: Math.max(0, parseSafeInt(read('impressions'))), reach: Math.max(0, parseSafeInt(read('reach'))), clicks: Math.max(0, parseSafeInt(read('clicks'))), results: Math.max(0, parseSafeFloat(read('results'))),
      frequency: Math.max(0, parseSafeFloat(read('frequency'))), cpm: Math.max(0, parseSafeFloat(read('cpm'))), ctr: Math.max(0, parseSafeFloat(read('ctr'))), cpc: Math.max(0, parseSafeFloat(read('cpc'))),
      resultType: String(read('resultType') || '').trim(), attribution: String(read('attribution') || '').trim(), delivery: String(read('delivery') || '').trim(), startDate: isoDateFromLooseValue(read('startDate')), endDate: isoDateFromLooseValue(read('endDate')), raw
    };
  }).filter(row => row.spend > 0 || row.results > 0 || row.impressions > 0 || row.clicks > 0);
  const level = fieldMap.adName ? 'ads' : fieldMap.adSetName ? 'adsets' : fieldMap.campaignName ? 'campaigns' : 'unknown';
  const dates = rows.flatMap(row => [row.startDate, row.endDate]).filter(Boolean).sort();
  return { rows, detectedColumns: Object.keys(fieldMap), level, currency: detectCurrencyFromRows(rawRows), dateRange: { start: dates[0] || '', end: dates[dates.length - 1] || '' }, resultTypes: [...new Set(rows.map(row => row.resultType).filter(Boolean))] };
};
export const buildAdSetsFromMetaRows = (rows = [], level = 'unknown') => {
  const groups = new Map();
  rows.forEach((row, index) => {
    const groupName = level === 'campaigns' ? (row.campaignName || `Campaña ${index + 1}`) : (row.adSetName || row.campaignName || `Conjunto ${index + 1}`);
    if (!groups.has(groupName)) groups.set(groupName, { id: generateId(), name: groupName, ads: [] });
    groups.get(groupName).ads.push({ id: generateId(), name: row.adName || row.adSetName || row.campaignName || `Fila ${row.rowNumber}`, spend: row.spend ? String(row.spend) : '', leads: row.results ? String(row.results) : '', sales: '', revenue: '', meta: { ...row, raw: undefined } });
  });
  return [...groups.values()].filter(group => group.ads.length > 0);
};
export const calculateMediaEfficiency = (sets = []) => {
  const rows = sets.flatMap(set => (set.ads || []).filter(ad => ad.meta).map(ad => ({ ...ad.meta, id: ad.id, groupName: set.name, adName: ad.name || ad.meta?.adName || '' })));
  if (!rows.length) return null;
  const sum = (field) => rows.reduce((total, row) => total + safeNum(row[field]), 0);
  const spend = sum('spend'), impressions = sum('impressions'), reach = sum('reach'), clicks = sum('clicks'), resultsCount = sum('results');
  const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0; const cpc = clicks > 0 ? spend / clicks : 0; const cpm = impressions > 0 ? (spend / impressions) * 1000 : 0; const frequency = reach > 0 ? impressions / reach : 0; const costPerResult = resultsCount > 0 ? spend / resultsCount : 0;
  const validCosts = rows.map(row => row.results > 0 ? row.spend / row.results : 0).filter(value => value > 0).sort((a, b) => a - b); const medianCost = validCosts.length ? validCosts[Math.floor(validCosts.length / 2)] : 0;
  const enhancedRows = rows.map(row => { const rowCtr = row.impressions > 0 ? (row.clicks / row.impressions) * 100 : safeNum(row.ctr); const rowCpr = row.results > 0 ? row.spend / row.results : 0; const spendShare = spend > 0 ? (row.spend / spend) * 100 : 0; const resultShare = resultsCount > 0 ? (row.results / resultsCount) * 100 : 0; const relativeCostScore = rowCpr > 0 && medianCost > 0 ? Math.min(100, (medianCost / rowCpr) * 80) : 20; const ctrScore = Math.min(100, (rowCtr / 2) * 100); const efficiencyScore = Math.round((relativeCostScore * 0.55) + (ctrScore * 0.25) + (Math.min(100, row.results * 8) * 0.20)); return { ...row, ctr: rowCtr, costPerResult: rowCpr, spendShare, resultShare, efficiencyScore }; }).sort((a, b) => b.efficiencyScore - a.efficiencyScore);
  const frequencyScore = frequency <= 2.5 ? 100 : frequency <= 3.5 ? 75 : frequency <= 5 ? 45 : 20; const ctrScore = Math.min(100, (ctr / 2) * 100); const resultScore = Math.min(100, resultsCount * 5); const costScore = costPerResult > 0 && medianCost > 0 ? Math.min(100, (medianCost / costPerResult) * 85) : 35;
  const score = Math.round((ctrScore * 0.30) + (costScore * 0.30) + (frequencyScore * 0.20) + (resultScore * 0.20));
  const alerts = []; if (frequency > 3.5 && ctr < 1.2) alerts.push('saturation'); if (enhancedRows.some(row => row.spendShare >= 30 && row.resultShare + 10 < row.spendShare)) alerts.push('concentratedSpend');
  return { available: true, score, spend, impressions, reach, clicks, results: resultsCount, ctr, cpc, cpm, frequency, costPerResult, rows: enhancedRows, alerts };
};

