import { safeNum } from './safeMath';

export const normalizeStoredHistoryRecord = (item) => {
  if (!item || typeof item !== 'object' || !item.results || typeof item.results !== 'object') return null;
  return {
    ...item,
    clientName: typeof item.clientName === 'string' && item.clientName.trim() ? item.clientName : 'Sin Nombre',
    formData: item.formData && typeof item.formData === 'object' ? item.formData : {},
    date: item.date || new Date(0).toISOString()
  };
};

export const sanitizeStoredHistory = (items) => Array.isArray(items)
  ? items.map(normalizeStoredHistoryRecord).filter(Boolean)
  : [];

// --- HISTORIAL SaaS: FIRESTORE COMO FUENTE PRINCIPAL + RESPALDO LOCAL POR USUARIO ---
export const getHistoryStorageKey = (uid) => `anareqHistory:${uid}`;

export const readLocalHistoryBackup = (uid) => {
  if (!uid) return { history: [], usedLegacyBackup: false };
  try {
    const scoped = localStorage.getItem(getHistoryStorageKey(uid));
    if (scoped) return { history: sanitizeStoredHistory(JSON.parse(scoped)), usedLegacyBackup: false };

    // Migración única y conservadora desde versiones anteriores:
    // solo se considera el historial global si todavía no existe respaldo aislado para este uid.
    const legacy = localStorage.getItem('anareqHistory');
    return legacy
      ? { history: sanitizeStoredHistory(JSON.parse(legacy)), usedLegacyBackup: true }
      : { history: [], usedLegacyBackup: false };
  } catch (error) {
    console.warn('Could not read local history backup:', error);
    return { history: [], usedLegacyBackup: false };
  }
};

export const saveLocalHistoryBackup = (uid, items) => {
  if (!uid) return;
  try {
    localStorage.setItem(getHistoryStorageKey(uid), JSON.stringify(sanitizeStoredHistory(items)));
  } catch (error) {
    console.warn('Could not persist local history backup:', error);
  }
};

export const mergeHistoryRecords = (...collections) => {
  const byId = new Map();
  collections.flat().forEach((item) => {
    const safeItem = normalizeStoredHistoryRecord(item);
    if (!safeItem) return;
    const stableId = safeItem.id || `${safeItem.clientName}:${safeItem.date}`;
    if (!byId.has(stableId)) byId.set(stableId, safeItem);
  });
  return [...byId.values()].sort((a, b) => new Date(b?.date || 0) - new Date(a?.date || 0));
};

