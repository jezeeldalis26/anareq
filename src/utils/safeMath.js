export const safeNum = (val) => (isNaN(val) || !isFinite(val) ? 0 : val);

export const parseSafeFloat = (val) => {
  if (!val) return 0;
  let s = String(val).trim();
  s = s.replace(/\s/g, ''); // Quita espacios vacíos
  
  // Si tiene punto y coma (ej. 1,500.50 o 1.500,50)
  if (s.includes(',') && s.includes('.')) {
    if (s.lastIndexOf(',') > s.lastIndexOf('.')) {
      // Formato EU: 1.500,50 -> 1500.50
      s = s.replace(/\./g, '').replace(',', '.');
    } else {
      // Formato US: 1,500.50 -> 1500.50
      s = s.replace(/,/g, '');
    }
  } else if (s.includes(',')) {
    // Si tiene más de una coma (ej. 1,000,000)
    if ((s.match(/,/g) || []).length > 1) {
      s = s.replace(/,/g, '');
    } else {
      // Una sola coma
      const parts = s.split(',');
      if (parts[1] && parts[1].length === 3) {
        // Si hay exactamente 3 dígitos después de la coma, es casi seguro un mil (1,500 -> 1500)
        s = s.replace(',', '');
      } else {
        // De lo contrario, es un decimal (15,50 -> 15.5)
        s = s.replace(',', '.');
      }
    }
  }
  return parseFloat(s) || 0;
};

// parseSafeInt ahora utiliza la protección robusta de parseSafeFloat
export const parseSafeInt = (val) => {
  if (!val) return 0;
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

