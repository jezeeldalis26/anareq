export const safeNum = (val) => (isNaN(val) || !isFinite(val) ? 0 : Number(val));

export const parseSafeFloat = (val) => {
  if (val === undefined || val === null || val === '') return 0;
  if (typeof val === 'number') return safeNum(val);

  let s = String(val)
    .trim()
    .replace(/\u00a0/g, '')
    .replace(/\s/g, '');

  if (!s) return 0;

  const isNegativeByParentheses = /^\(.*\)$/.test(s);
  s = s.replace(/[()]/g, '');

  // Mantiene solo dígitos, separadores decimales/miles y signo.
  // Esto permite leer valores como R$1.234,56, US$1,234.56, 12,5% o $99.90.
  s = s.replace(/[^0-9,\.\-+]/g, '');

  if (!s || s === '-' || s === '+') return 0;

  const isNegative = isNegativeByParentheses || s.startsWith('-');
  s = s.replace(/[+-]/g, '');

  if (s.includes(',') && s.includes('.')) {
    if (s.lastIndexOf(',') > s.lastIndexOf('.')) {
      // Formato latino/europeo: 1.500,50 -> 1500.50
      s = s.replace(/\./g, '').replace(',', '.');
    } else {
      // Formato US: 1,500.50 -> 1500.50
      s = s.replace(/,/g, '');
    }
  } else if (s.includes(',')) {
    const commaCount = (s.match(/,/g) || []).length;
    if (commaCount > 1) {
      s = s.replace(/,/g, '');
    } else {
      const [integerPart, decimalPart = ''] = s.split(',');
      if (decimalPart.length === 3 && integerPart.length <= 3) {
        s = s.replace(',', '');
      } else {
        s = s.replace(',', '.');
      }
    }
  } else if ((s.match(/\./g) || []).length > 1) {
    s = s.replace(/\./g, '');
  }

  const parsed = parseFloat(s);
  if (!isFinite(parsed) || isNaN(parsed)) return 0;

  return isNegative ? -Math.abs(parsed) : parsed;
};

// parseSafeInt utiliza la protección robusta de parseSafeFloat.
export const parseSafeInt = (val) => {
  if (val === undefined || val === null || val === '') return 0;
  return Math.round(parseSafeFloat(val));
};

export const generateId = () => {
  return typeof crypto !== 'undefined' && crypto.randomUUID 
    ? crypto.randomUUID() 
    : Math.random().toString(36).substring(2, 15);
};

export const escapeCSV = (value) => {
  const normalized = value === undefined || value === null ? '' : String(value);
  return `"${normalized.replace(/"/g, '""')}"`;
};
