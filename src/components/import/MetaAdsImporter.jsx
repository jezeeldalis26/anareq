import React, { useRef, useState } from 'react';
import { Upload, FileSpreadsheet, XCircle } from 'lucide-react';
import { CURRENCY_OPTIONS } from '../../constants/currencies';
import { EMPTY_META_IMPORT, buildAdSetsFromMetaRows, normalizeImportedMetaRows, waitForExternalLibrary } from '../../services/metaImportService';
import { MetaAdsImportPreview } from './MetaAdsImportPreview';

export function MetaAdsImporter({ t, money, onApply, onCurrencyDetected }) {
  const inputRef = useRef(null);
  const [metaImport, setMetaImport] = useState({ ...EMPTY_META_IMPORT });
  const [loading, setLoading] = useState(false);

  const discard = () => { setMetaImport({ ...EMPTY_META_IMPORT }); if (inputRef.current) inputRef.current.value = ''; };
  const toggle = (id) => setMetaImport((prev) => ({ ...prev, selectedIds: prev.selectedIds.includes(id) ? prev.selectedIds.filter((item) => item !== id) : [...prev.selectedIds, id] }));
  const upload = async (event) => {
    const file = event.target.files?.[0]; if (!file) return;
    setLoading(true);
    try {
      if (file.size > 5 * 1024 * 1024) throw new Error(t('importTooLarge'));
      const extension = file.name.split('.').pop()?.toLowerCase(); let rawRows = []; let sourceFormat = '';
      if (extension === 'csv') {
        sourceFormat = 'csv'; await waitForExternalLibrary({ marker: 'papaparse', isReady: () => Boolean(window.Papa?.parse), scripts: ['https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.4.1/papaparse.min.js','https://cdn.jsdelivr.net/npm/papaparse@5.4.1/papaparse.min.js'] });
        rawRows = await new Promise((resolve, reject) => window.Papa.parse(file, { header: true, skipEmptyLines: true, complete: (result) => resolve(result.data || []), error: reject }));
      } else if (['xlsx', 'xls'].includes(extension)) {
        sourceFormat = 'xlsx'; await waitForExternalLibrary({ marker: 'sheetjs', isReady: () => Boolean(window.XLSX?.read), scripts: ['https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js','https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js'] });
        const workbook = window.XLSX.read(await file.arrayBuffer(), { type: 'array' }); rawRows = window.XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], { defval: '' });
      } else throw new Error(t('importUnsupported'));
      const normalized = normalizeImportedMetaRows(rawRows);
      setMetaImport({ status: normalized.rows.length ? 'preview' : 'error', fileName: file.name, sourceFormat, ...normalized, selectedIds: normalized.rows.map((row) => row.id), warnings: [t('importRealDataReminder')], errors: normalized.rows.length ? [] : [t('importNoRows')], importedAt: '' });
    } catch (error) { setMetaImport({ ...EMPTY_META_IMPORT, status: 'error', fileName: file.name, errors: [error.message] }); }
    finally { setLoading(false); }
  };
  const apply = () => {
    const rows = metaImport.rows.filter((row) => metaImport.selectedIds.includes(row.id));
    const adSets = buildAdSetsFromMetaRows(rows, metaImport.level);
    if (metaImport.currency && CURRENCY_OPTIONS.some((item) => item.code === metaImport.currency)) onCurrencyDetected?.(metaImport.currency);
    onApply?.({ adSets, rows, metaImport: { ...metaImport, status: 'applied', importedAt: new Date().toISOString() } });
  };
  return <section className="rounded-2xl border border-stone-200 bg-white p-4"><div className="flex items-center gap-3"><FileSpreadsheet className="h-5 w-5 text-orange-600"/><div><h3 className="font-black">{t('importTitle')}</h3><p className="text-xs text-stone-500">{t('importDesc')}</p></div></div><input ref={inputRef} className="hidden" type="file" accept=".csv,.xlsx,.xls" onChange={upload}/><button type="button" onClick={() => inputRef.current?.click()} className="mt-4 rounded-xl bg-orange-600 px-4 py-2 text-xs font-black text-white"><Upload className="mr-2 inline h-4 w-4"/>{loading ? t('analyzing') : t(metaImport.fileName ? 'replaceFile' : 'chooseFile')}</button>{metaImport.status === 'preview' && <div className="mt-4 space-y-3"><MetaAdsImportPreview rows={metaImport.rows} selectedIds={metaImport.selectedIds} onToggle={toggle} t={t} money={money}/><div className="flex gap-2"><button type="button" onClick={apply} className="rounded-xl bg-stone-900 px-4 py-2 text-xs font-black text-white">{t('importSelected')}</button><button type="button" onClick={discard} className="rounded-xl border px-4 py-2 text-xs font-black"><XCircle className="mr-1 inline h-4 w-4"/>{t('importCancel')}</button></div></div>}{metaImport.errors?.map((error) => <p key={error} className="mt-3 text-xs font-bold text-red-600">{error}</p>)}</section>;
}
