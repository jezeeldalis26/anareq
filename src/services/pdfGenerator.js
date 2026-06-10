import { waitForExternalLibrary } from './metaImportService';
import { safeNum, parseSafeFloat, parseSafeInt } from '../utils/safeMath';
import { translateStatus, getMeasurementConfidenceMessage } from '../constants/translations';
import { LANGUAGE_LOCALES } from '../constants/currencies';

export const buildPdfFileName = (client = 'Diagnostico') => {
  const safeClient = String(client || 'Diagnostico')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9_-]+/g, '_')
    .replace(/^_+|_+$/g, '') || 'Diagnostico';
  return `anareQ_${safeClient}.pdf`;
};

// Generador PDF ejecutivo ligero: dibuja directamente con jsPDF.
// Evita capturas pesadas del DOM y mantiene el reporte compacto en dos páginas A4.
export const generateProfessionalPdfBlob = async (context) => {
const { results, clientName = '', formData = {}, currencyCode = 'USD', languageCode = 'es', auditSource = 'manual', primaryBottleneck = null, t, money } = context;
  const locale = LANGUAGE_LOCALES[languageCode] || LANGUAGE_LOCALES.es;
  if (!results) throw new Error('Generate a diagnosis before exporting the PDF');

  await waitForExternalLibrary({
    marker: 'jspdf',
    isReady: () => Boolean(window.jspdf?.jsPDF),
    scripts: [
      'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
      'https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js',
      'https://unpkg.com/jspdf@2.5.1/dist/jspdf.umd.min.js'
    ]
  });

  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4', compress: true });
  const PAGE_W = 210;
  const PAGE_H = 297;
  const M = 14;
  const CONTENT_W = PAGE_W - (M * 2);
  const FOOTER_Y = 288;
  const colors = {
    ink: [28, 25, 23],
    muted: [120, 113, 108],
    line: [231, 229, 228],
    soft: [250, 250, 249],
    orange: [253, 102, 13],
    orangeSoft: [255, 247, 237],
    amberSoft: [255, 251, 235],
    white: [255, 255, 255]
  };
  const safePdfText = (value = '') => String(value ?? '')
    .replace(/[–—]/g, '-')
    .replace(/·/g, '|')
    .replace(/\s+/g, ' ')
    .trim();
  const truncate = (value, max = 70) => {
    const normalized = safePdfText(value);
    return normalized.length > max ? `${normalized.slice(0, max - 3)}...` : normalized;
  };
  const setText = (color = colors.ink) => pdf.setTextColor(...color);
  const setFill = (color = colors.white) => pdf.setFillColor(...color);
  const setDraw = (color = colors.line) => pdf.setDrawColor(...color);
  const lines = (value, width, size = 9) => {
    pdf.setFontSize(size);
    return pdf.splitTextToSize(safePdfText(value), width);
  };
  const box = (x, y, w, h, fill = colors.white, stroke = colors.line, radius = 3) => {
    setFill(fill); setDraw(stroke); pdf.setLineWidth(0.25);
    pdf.roundedRect(x, y, w, h, radius, radius, 'FD');
  };
  const sectionTitle = (title, y) => {
    pdf.setFont('helvetica', 'bold'); pdf.setFontSize(9); setText(colors.orange);
    pdf.text(safePdfText(title).toUpperCase(), M, y);
    setDraw(colors.line); pdf.setLineWidth(0.25); pdf.line(M, y + 2.2, PAGE_W - M, y + 2.2);
    return y + 7;
  };
  const footer = (pageNo, totalPages = 2) => {
    setDraw(colors.line); pdf.setLineWidth(0.2); pdf.line(M, FOOTER_Y - 4, PAGE_W - M, FOOTER_Y - 4);
    pdf.setFont('helvetica', 'normal'); pdf.setFontSize(7.5); setText(colors.muted);
    pdf.text(safePdfText(t('pdfReportFooter')), M, FOOTER_Y);
    pdf.text(`${pageNo}/${totalPages}`, PAGE_W - M, FOOTER_Y, { align: 'right' });
  };
  const brand = (y = 13) => {
    pdf.setFont('helvetica', 'bold'); pdf.setFontSize(18); setText(colors.white);
    pdf.text('anare', M, y + 8);
    const brandWidth = pdf.getTextWidth('anare');
    setText(colors.orange); pdf.text('Q', M + brandWidth + 0.8, y + 8);
  };
  const pageHeader = ({ pageNo, compact = false }) => {
    setFill(colors.ink); pdf.rect(0, 0, PAGE_W, compact ? 23 : 31, 'F');
    brand(compact ? 5 : 8);
    pdf.setFont('helvetica', 'bold'); pdf.setFontSize(compact ? 11 : 14); setText(colors.white);
    pdf.text(safePdfText(t('pdfReportTitle')), PAGE_W - M, compact ? 14 : 17, { align: 'right' });
    pdf.setFontSize(7); setText(colors.orange);
    pdf.text(`ANAREQ | ${safePdfText(clientName || t('unnamedProject')).toUpperCase()}`, PAGE_W - M, compact ? 19 : 23, { align: 'right' });
    return compact ? 31 : 39;
  };
  const metricCard = (x, y, w, label, value, hint = '') => {
    box(x, y, w, 18, colors.white, colors.line, 3);
    pdf.setFont('helvetica', 'bold'); pdf.setFontSize(6.8); setText(colors.muted);
    pdf.text(safePdfText(label).toUpperCase(), x + 4, y + 5);
    pdf.setFontSize(12); setText(colors.ink); pdf.text(safePdfText(value), x + 4, y + 11.8);
    if (hint) { pdf.setFont('helvetica', 'normal'); pdf.setFontSize(6.7); setText(colors.muted); pdf.text(safePdfText(hint), x + 4, y + 16); }
  };
  const scoreCard = (x, y, w, label, value) => {
    box(x, y, w, 13.5, colors.soft, colors.line, 3);
    pdf.setFont('helvetica', 'bold'); pdf.setFontSize(6.7); setText(colors.muted);
    pdf.text(safePdfText(label), x + 4, y + 5.2);
    pdf.setFontSize(10.5); setText(colors.orange);
    pdf.text(`${Math.round(safeNum(value))}/100`, x + w - 4, y + 8.9, { align: 'right' });
  };
  const detailCard = (x, y, w, label, value) => {
    box(x, y, w, 15, colors.soft, colors.line, 3);
    pdf.setFont('helvetica', 'bold'); pdf.setFontSize(6.5); setText(colors.muted);
    pdf.text(safePdfText(label).toUpperCase(), x + 4, y + 5);
    pdf.setFontSize(10); setText(colors.ink); pdf.text(safePdfText(value), x + 4, y + 11.5);
  };

  // PAGINA 1 - RESUMEN EJECUTIVO
  let y = pageHeader({ pageNo: 1 });
  pdf.setFont('helvetica', 'bold'); pdf.setFontSize(7); setText(colors.muted);
  pdf.text(safePdfText(t('pdfClient')).toUpperCase(), M, y);
  pdf.text(safePdfText(t('pdfGeneratedOn')).toUpperCase(), 102, y);
  pdf.text(safePdfText(t('pdfPeriod')).toUpperCase(), 141, y);
  pdf.setFontSize(12); setText(colors.ink);
  pdf.text(truncate(clientName || t('unnamedProject'), 34), M, y + 7);
  pdf.setFontSize(8.5);
  pdf.text(new Date().toLocaleDateString(locale), 102, y + 7);
  const period = `${formData.startDate || t('pdfStart')} - ${formData.endDate || t('pdfEnd')}`;
  pdf.text(truncate(period, 34), 141, y + 7);
  if (formData.campaignName) {
    pdf.setFont('helvetica', 'bold'); pdf.setFontSize(6.6); setText(colors.muted);
    pdf.text(safePdfText(t('campaignName')).toUpperCase(), M, y + 13);
    pdf.setFontSize(8.4); setText(colors.ink);
    pdf.text(truncate(formData.campaignName, 72), M, y + 18);
    y += 21;
  } else {
    y += 15;
  }

  box(M, y, CONTENT_W, 29, colors.orangeSoft, [253, 186, 116], 4);
  pdf.setFont('helvetica', 'bold'); pdf.setFontSize(7); setText(colors.orange);
  pdf.text(safePdfText(t('globalScore')).toUpperCase(), M + 5, y + 7);
  pdf.setFontSize(21); setText(colors.ink); pdf.text(`${results.score}/100`, M + 5, y + 19);
  pdf.setFontSize(8); setText(colors.orange);
  pdf.text(translateStatus(languageCode, results.statusText), M + 41, y + 18.7);
  pdf.setFont('helvetica', 'bold'); pdf.setFontSize(9); setText(colors.ink);
  const summaryLines = lines(results.summary, 104, 9).slice(0, 3);
  pdf.text(summaryLines, M + 80, y + 10);
  y += 35;

  const metricGap = 4;
  const metricW = (CONTENT_W - (metricGap * 2)) / 3;
  metricCard(M, y, metricW, t('pdfSpend'), money(results.totalSpend), `MER ${safeNum(results.mer).toFixed(2)}x`);
  metricCard(M + metricW + metricGap, y, metricW, t('pdfRevenue'), money(results.totalRevenue), `${t('conversionLabel')} ${safeNum(results.conversion).toFixed(1)}%`);
  metricCard(M + (metricW + metricGap) * 2, y, metricW, t('pdfProfit'), money(results.profit), `ROI ${safeNum(results.roi).toFixed(1)}%`);
  y += 24;

  y = sectionTitle(t('pdfKeyMetrics'), y);
  const keyMetrics = [
    ['MER', `${safeNum(results.mer).toFixed(2)}x`],
    ['CPA', money(results.cpa, 2)],
    ['CPL', money(results.cpl, 2)],
    [t('conversionLabel'), `${safeNum(results.conversion).toFixed(1)}%`],
    [t('pdfTicket'), money(results.ticket)],
    [t('globalScore'), `${results.score}/100`]
  ];
  keyMetrics.forEach(([label, value], idx) => {
    const rowY = y + (idx * 6.2);
    if (idx % 2 === 0) { setFill(colors.soft); pdf.rect(M, rowY - 3.8, CONTENT_W, 6, 'F'); }
    pdf.setFont('helvetica', 'bold'); pdf.setFontSize(7.4); setText(colors.muted); pdf.text(safePdfText(label), M + 4, rowY);
    setText(colors.ink); pdf.text(safePdfText(value), PAGE_W - M - 4, rowY, { align: 'right' });
  });
  y += 40;

  y = sectionTitle(t('pdfScoreComponents'), y);
  const scoreGap = 4;
  const scoreW = (CONTENT_W - scoreGap) / 2;
  scoreCard(M, y, scoreW, t('pdfAdsScore'), results.adScore);
  scoreCard(M + scoreW + scoreGap, y, scoreW, t('pdfSalesScore'), results.salesScore);
  scoreCard(M, y + 17, scoreW, t('pdfMarginScore'), results.marginScore);
  scoreCard(M + scoreW + scoreGap, y + 17, scoreW, t('pdfStabilityScore'), results.stabilityScore);
  y += 35;

  if (primaryBottleneck) {
    y = sectionTitle(t('pdfPrimaryBottleneck'), y);
    const bottleneckLines = lines(primaryBottleneck.message, CONTENT_W - 12, 8.2).slice(0, 3);
    const bottleneckH = Math.max(18, 11 + (bottleneckLines.length * 4));
    box(M, y, CONTENT_W, bottleneckH, colors.amberSoft, [253, 186, 116], 3);
    pdf.setFont('helvetica', 'bold'); pdf.setFontSize(7.5); setText(colors.orange);
    pdf.text(`${safePdfText(primaryBottleneck.title).toUpperCase()} | ${Math.round(primaryBottleneck.score)}/100`, M + 5, y + 6);
    pdf.setFont('helvetica', 'normal'); pdf.setFontSize(8.2); setText(colors.ink);
    pdf.text(bottleneckLines, M + 5, y + 11.5);
  }
  footer(1, 2);

  // PAGINA 2 - PLAN DE ACCION Y DETALLES
  pdf.addPage();
  y = pageHeader({ pageNo: 2, compact: true });
  pdf.setFont('helvetica', 'bold'); pdf.setFontSize(11); setText(colors.ink);
  pdf.text(languageCode === 'en' ? 'Details and action plan' : languageCode === 'pt' ? 'Detalhes e plano de ação' : 'Detalles y plan de acción', M, y);
  pdf.setFont('helvetica', 'normal'); pdf.setFontSize(7.8); setText(colors.muted);
  const sourceLabel = auditSource === 'meta_csv' ? t('sourceCsv') : auditSource === 'meta_xlsx' ? t('sourceXlsx') : t('sourceManual');
  pdf.text(`${safePdfText(clientName || t('unnamedProject'))}${formData.campaignName ? ` | ${safePdfText(formData.campaignName)}` : ''} | ${safePdfText(currencyCode)} | ${safePdfText(t('source'))}: ${safePdfText(sourceLabel)}`, M, y + 5);
  y += 12;

  if (results.hasOpCosts) {
    y = sectionTitle(t('realBusiness'), y);
    const detailGap = 4;
    const detailW = (CONTENT_W - detailGap * 2) / 3;
    detailCard(M, y, detailW, t('opExpenses'), money(results.operatingCosts));
    detailCard(M + detailW + detailGap, y, detailW, t('pdfNetProfit'), money(results.realNetProfit));
    detailCard(M + (detailW + detailGap) * 2, y, detailW, t('pdfNetMargin'), `${safeNum(results.realNetMargin).toFixed(1)}%`);
    y += 21;
  }

  if (results.measurementConfidence) {
    y = sectionTitle(t('measurementTitle'), y);
    const confidenceText = `${results.measurementConfidence.score}/100 | ${translateStatus(languageCode, results.measurementConfidence.label)}`;
    const messageLines = lines(getMeasurementConfidenceMessage(languageCode, results.measurementConfidence.status), CONTENT_W - 54, 7.6).slice(0, 3);
    const h = Math.max(17, 10 + (messageLines.length * 3.7));
    box(M, y, CONTENT_W, h, colors.soft, colors.line, 3);
    pdf.setFont('helvetica', 'bold'); pdf.setFontSize(10); setText(colors.orange); pdf.text(confidenceText, M + 5, y + 7);
    pdf.setFont('helvetica', 'normal'); pdf.setFontSize(7.6); setText(colors.ink); pdf.text(messageLines, M + 43, y + 6);
    y += h + 5;
  }

  if (results.mediaEfficiency?.available) {
    y = sectionTitle(t('mediaScoreTitle'), y);
    const detailGap = 4;
    const detailW = (CONTENT_W - detailGap * 2) / 3;
    detailCard(M, y, detailW, t('mediaEfficiencyScore'), `${safeNum(results.mediaEfficiency.score)}/100`);
    detailCard(M + detailW + detailGap, y, detailW, t('ctr'), `${safeNum(results.mediaEfficiency.ctr).toFixed(2)}%`);
    detailCard(M + (detailW + detailGap) * 2, y, detailW, t('costPerResult'), money(results.mediaEfficiency.costPerResult, 2));
    y += 21;
  }

  y = sectionTitle(t('pdfRecommendations'), y);
  const recommendations = Array.isArray(results.recommendations) ? results.recommendations.slice(0, 3) : [];
  recommendations.forEach((rec, idx) => {
    const recLines = lines(`${idx + 1}. ${rec.text}`, CONTENT_W - 10, 8).slice(0, 3);
    const h = Math.max(12, 6 + (recLines.length * 3.7));
    box(M, y, CONTENT_W, h, idx === 0 ? colors.orangeSoft : colors.white, colors.line, 3);
    pdf.setFont('helvetica', 'normal'); pdf.setFontSize(8); setText(colors.ink); pdf.text(recLines, M + 5, y + 5.7);
    y += h + 3;
  });
  y += 2;

  if (formData.generalNotes) {
    y = sectionTitle(t('auditNotesPdf'), y);
    const noteText = truncate(formData.generalNotes, 460);
    const noteLines = lines(noteText, CONTENT_W - 10, 8).slice(0, 5);
    const h = Math.max(13, 7 + noteLines.length * 3.7);
    box(M, y, CONTENT_W, h, colors.orangeSoft, [253, 186, 116], 3);
    pdf.setFont('helvetica', 'normal'); pdf.setFontSize(8); setText(colors.ink); pdf.text(noteLines, M + 5, y + 6);
    y += h + 5;
  }

  const savedSets = Array.isArray(results.adSetsSaved) ? results.adSetsSaved : [];
  if (savedSets.length > 0) {
    y = sectionTitle(t('setsAds'), y);
    const availableRows = Math.max(1, Math.min(7, Math.floor((FOOTER_Y - 10 - y - 10) / 7)));
    const rows = savedSets.slice(0, availableRows).map((set, idx) => {
      const ads = Array.isArray(set.ads) ? set.ads : [];
      const setSpend = ads.reduce((sum, ad) => sum + parseSafeFloat(ad.spend), 0);
      const setRevenue = ads.reduce((sum, ad) => sum + parseSafeFloat(ad.revenue), 0);
      const setLeads = ads.reduce((sum, ad) => sum + parseSafeInt(ad.leads), 0);
      const setSales = ads.reduce((sum, ad) => sum + parseSafeInt(ad.sales), 0);
      return [truncate(set.name || `#${idx + 1}`, 32), money(setSpend), String(setLeads), String(setSales), `${setSpend > 0 ? (setRevenue / setSpend).toFixed(2) : '0.00'}x`];
    });
    const cols = [M, M + 78, M + 117, M + 141, M + 164];
    setFill(colors.ink); pdf.rect(M, y, CONTENT_W, 7, 'F');
    const headers = [t('setsAds'), t('pdfSpend'), t('leads'), t('sales'), 'MER'];
    pdf.setFont('helvetica', 'bold'); pdf.setFontSize(6.7); setText(colors.white);
    headers.forEach((header, i) => pdf.text(safePdfText(header), cols[i] + (i === 0 ? 3 : 0), y + 4.6, i === 0 ? {} : { align: 'right' }));
    y += 7;
    rows.forEach((row, rowIdx) => {
      if (rowIdx % 2 === 0) { setFill(colors.soft); pdf.rect(M, y, CONTENT_W, 7, 'F'); }
      pdf.setFont('helvetica', rowIdx === 0 ? 'bold' : 'normal'); pdf.setFontSize(6.8); setText(colors.ink);
      row.forEach((cell, i) => pdf.text(safePdfText(cell), cols[i] + (i === 0 ? 3 : 0), y + 4.7, i === 0 ? {} : { align: 'right' }));
      y += 7;
    });
    if (savedSets.length > rows.length) {
      pdf.setFont('helvetica', 'italic'); pdf.setFontSize(6.6); setText(colors.muted);
      pdf.text(`+ ${savedSets.length - rows.length} ${languageCode === 'en' ? 'additional ad sets available in the dashboard' : languageCode === 'pt' ? 'conjuntos adicionais disponíveis no painel' : 'conjuntos adicionales disponibles en el panel'}`, M, y + 5);
    }
  }

  footer(2, 2);
  return pdf.output('blob');
};

export const downloadPdfBlob = (blob, fileName = buildPdfFileName()) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
