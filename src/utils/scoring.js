import { NARRATIVE_TRANSLATIONS, translateUI } from '../constants/translations';
import { safeNum } from './safeMath';

export const interpolateProgressiveScore = (value, points) => {
  const safeValue = safeNum(value);
  if (safeValue <= points[0][0]) return points[0][1];
  for (let i = 1; i < points.length; i += 1) {
    const [x2, y2] = points[i]; const [x1, y1] = points[i - 1];
    if (safeValue <= x2) return y1 + ((safeValue - x1) / Math.max(x2 - x1, 0.0001)) * (y2 - y1);
  }
  return points[points.length - 1][1];
};

export const EMPTY_MEASUREMENT_ANSWERS = {
  trackingMethod: '',
  attributionWindow: '',
  verifiedEvents: '',
  offsiteSales: '',
  offlineConversions: ''
};

export const calculateMeasurementConfidence = (answers) => {
  if (!answers || !Object.values(answers).some(Boolean)) return null;

  let score = 50;
  if (answers.trackingMethod === 'capi') score += 25;
  else if (answers.trackingMethod === 'pixel') score += 10;
  else if (answers.trackingMethod === 'unsure') score -= 10;

  if (answers.attributionWindow === 'yes') score += 10;
  else if (answers.attributionWindow === 'no') score -= 5;
  else if (answers.attributionWindow === 'unsure') score -= 3;

  if (answers.verifiedEvents === 'verified') score += 15;
  else if (answers.verifiedEvents === 'unchecked') score -= 8;
  else if (answers.verifiedEvents === 'none') score -= 15;

  if (answers.offsiteSales === 'website') score += 5;
  else if (answers.offsiteSales === 'offsite') score -= 12;
  else if (answers.offsiteSales === 'both') score -= 5;

  if (answers.offlineConversions === 'yes') score += 10;
  else if (answers.offlineConversions === 'no' && answers.offsiteSales !== 'website') score -= 10;
  else if (answers.offlineConversions === 'unsure') score -= 5;

  score = Math.max(0, Math.min(Math.round(score), 100));

  if (score >= 80) {
    return { score, label: 'ALTA', status: 'good', message: 'Los datos de Meta ofrecen un contexto de medición sólido para complementar esta auditoría.' };
  }
  if (score >= 50) {
    return { score, label: 'MEDIA', status: 'warning', message: 'Meta puede tener brechas de visibilidad. Contrasta sus resultados con tu facturación y cierres reales.' };
  }
  return { score, label: 'BAJA', status: 'danger', message: 'Tu configuración de medición presenta brechas importantes. Los datos manuales de ventas y facturación son la referencia principal para esta auditoría.' };
};

export const getPrimaryBottleneck = (result, language = 'es') => {
  if (!result) return null;
  const candidates = [
    { key: 'ads', title: fillNarrative(language, 'bottleneckAdsTitle'), score: safeNum(result.adScore), icon: 'MER', message: fillNarrative(language, 'bottleneckAds', { score: Math.round(safeNum(result.adScore)) }) },
    { key: 'sales', title: fillNarrative(language, 'bottleneckSalesTitle'), score: safeNum(result.salesScore), icon: 'VENTAS', message: fillNarrative(language, 'bottleneckSales', { score: Math.round(safeNum(result.salesScore)), conversion: safeNum(result.conversion).toFixed(1) }) },
    { key: 'margin', title: fillNarrative(language, 'bottleneckMarginTitle'), score: safeNum(result.marginScore), icon: 'MARGEN', message: fillNarrative(language, 'bottleneckMargin', { score: Math.round(safeNum(result.marginScore)) }) },
    { key: 'stability', title: fillNarrative(language, 'bottleneckStabilityTitle'), score: safeNum(result.stabilityScore), icon: 'MUESTRA', message: fillNarrative(language, 'bottleneckStability', { score: Math.round(safeNum(result.stabilityScore)) }) }
  ];
  return candidates.sort((a, b) => a.score - b.score)[0];
};



export const fillNarrative = (language, key, params = {}) => {
  let text = NARRATIVE_TRANSLATIONS[language]?.[key] || NARRATIVE_TRANSLATIONS.es[key] || key;
  Object.entries(params).forEach(([name, value]) => { text = text.replaceAll(`{${name}}`, value); });
  return text;
};
