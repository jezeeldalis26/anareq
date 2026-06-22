import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup,
  signInWithEmailAndPassword, createUserWithEmailAndPassword,
  sendPasswordResetEmail, signOut as firebaseSignOut
} from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, runTransaction } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { mergeHistoryRecords, sanitizeStoredHistory } from '../utils/historyHelpers';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const TRIAL_AUDIT_LIMIT = 3;
const TRIAL_DAYS = 3;
const DAY_MS = 24 * 60 * 60 * 1000;

export const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);
export const storage = getStorage(firebaseApp);
export const googleProvider = new GoogleAuthProvider();

export { doc, getDoc, setDoc, onAuthStateChanged };

export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);
export const signInWithEmail = (email, password) => signInWithEmailAndPassword(auth, email, password);
export const createAccountWithEmail = (email, password) => createUserWithEmailAndPassword(auth, email, password);
export const resetPassword = (email) => sendPasswordResetEmail(auth, email);
export const signOut = () => firebaseSignOut(auth);
export const getCurrentUserIdToken = (forceRefresh = false) => auth.currentUser?.getIdToken(forceRefresh);

const toMillis = (value) => {
  if (!value) return 0;
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const parsed = Date.parse(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  if (typeof value?.toDate === 'function') return value.toDate().getTime();
  if (typeof value?.seconds === 'number') return value.seconds * 1000;
  return 0;
};

const normalizeAccessState = (data = {}, fallbackEmail = '') => {
  const now = Date.now();
  const trialStartedAt = data.trialStartedAt || new Date(now).toISOString();
  const trialEndsAt = data.trialEndsAt || new Date(now + (TRIAL_DAYS * DAY_MS)).toISOString();
  const trialAuditsUsed = Number(data.trialAuditsUsed || 0);
  const subscriptionStatus = data.subscriptionStatus || 'trial';

  return {
    subscriptionStatus,
    accessSource: data.accessSource || (subscriptionStatus === 'trial' ? 'trial' : ''),
    planType: data.planType || null,
    trialStartedAt,
    trialEndsAt,
    trialAuditLimit: Number(data.trialAuditLimit || TRIAL_AUDIT_LIMIT),
    trialAuditsUsed,
    currentPeriodEnd: data.currentPeriodEnd || null,
    promoAccessEndsAt: data.promoAccessEndsAt || null,
    promoCodeUsed: data.promoCodeUsed || '',
    stripeCustomerId: data.stripeCustomerId || data.billing?.stripeCustomerId || '',
    stripeSubscriptionId: data.stripeSubscriptionId || data.billing?.stripeSubscriptionId || '',
    email: data.email || fallbackEmail || '',
    billing: data.billing || {}
  };
};

export const getAccessInfo = (state = {}) => {
  const accessState = normalizeAccessState(state);
  const now = Date.now();
  const currentPeriodEndMs = toMillis(accessState.currentPeriodEnd || accessState.billing?.currentPeriodEnd);
  const promoEndsMs = toMillis(accessState.promoAccessEndsAt);
  const trialEndsMs = toMillis(accessState.trialEndsAt);
  const hasStripeAccess = accessState.subscriptionStatus === 'active'
    && (!currentPeriodEndMs || currentPeriodEndMs > now);
  const hasPromoAccess = accessState.subscriptionStatus === 'promo'
    && (!promoEndsMs || promoEndsMs > now);
  const hasTrialAccess = accessState.subscriptionStatus === 'trial'
    && trialEndsMs > now
    && Number(accessState.trialAuditsUsed || 0) < Number(accessState.trialAuditLimit || TRIAL_AUDIT_LIMIT);

  let reason = '';
  if (!hasStripeAccess && !hasPromoAccess && !hasTrialAccess) {
    const trialFinishedByUse = Number(accessState.trialAuditsUsed || 0) >= Number(accessState.trialAuditLimit || TRIAL_AUDIT_LIMIT);
    const trialFinishedByTime = trialEndsMs > 0 && trialEndsMs <= now;
    reason = trialFinishedByUse ? 'audit_limit' : trialFinishedByTime ? 'trial_time' : 'no_access';
  }

  return {
    canUse: hasStripeAccess || hasPromoAccess || hasTrialAccess,
    isPaid: hasStripeAccess,
    isPromo: hasPromoAccess,
    isTrial: hasTrialAccess,
    reason,
    trialAuditsRemaining: Math.max(0, Number(accessState.trialAuditLimit || TRIAL_AUDIT_LIMIT) - Number(accessState.trialAuditsUsed || 0)),
    trialDaysRemaining: Math.max(0, Math.ceil((trialEndsMs - now) / DAY_MS)),
    status: hasStripeAccess ? 'active' : hasPromoAccess ? 'promo' : hasTrialAccess ? 'trial' : 'expired'
  };
};

const buildNewTrialState = (email = '') => {
  const now = Date.now();
  return {
    subscriptionStatus: 'trial',
    accessSource: 'trial',
    planType: null,
    trialStartedAt: new Date(now).toISOString(),
    trialEndsAt: new Date(now + (TRIAL_DAYS * DAY_MS)).toISOString(),
    trialAuditLimit: TRIAL_AUDIT_LIMIT,
    trialAuditsUsed: 0,
    currentPeriodEnd: null,
    promoAccessEndsAt: null,
    promoCodeUsed: '',
    email,
    updatedAt: new Date(now).toISOString()
  };
};

export async function ensureUserAccess(uid, email = '') {
  if (!uid) return null;
  const userRef = doc(db, 'users', uid);
  const snapshot = await getDoc(userRef);
  const data = snapshot.exists() ? snapshot.data() : {};

  if (!data?.subscriptionStatus) {
    const trialState = buildNewTrialState(email);
    await setDoc(userRef, trialState, { merge: true });
    return trialState;
  }

  const state = normalizeAccessState(data, email);
  const info = getAccessInfo(state);
  if (!info.canUse && state.subscriptionStatus === 'trial') {
    const expiredState = { ...state, subscriptionStatus: 'expired', updatedAt: new Date().toISOString() };
    await setDoc(userRef, { subscriptionStatus: 'expired', updatedAt: expiredState.updatedAt }, { merge: true });
    return expiredState;
  }
  return state;
}

export async function consumeTrialAudit(uid, email = '') {
  if (!uid) throw new Error('missing_uid');
  const userRef = doc(db, 'users', uid);

  return runTransaction(db, async (transaction) => {
    const snapshot = await transaction.get(userRef);
    const data = snapshot.exists() ? snapshot.data() : {};
    const baseState = data?.subscriptionStatus ? normalizeAccessState(data, email) : buildNewTrialState(email);
    const info = getAccessInfo(baseState);

    if (info.isPaid || info.isPromo) {
      transaction.set(userRef, { updatedAt: new Date().toISOString() }, { merge: true });
      return baseState;
    }

    if (info.isTrial) {
      const nextUsed = Number(baseState.trialAuditsUsed || 0) + 1;
      const nextStatus = nextUsed >= Number(baseState.trialAuditLimit || TRIAL_AUDIT_LIMIT)
        ? 'expired'
        : 'trial';
      const nextState = {
        ...baseState,
        trialAuditsUsed: nextUsed,
        subscriptionStatus: nextStatus,
        updatedAt: new Date().toISOString()
      };
      transaction.set(userRef, nextState, { merge: true });
      return nextState;
    }

    const expiredState = {
      ...baseState,
      subscriptionStatus: 'expired',
      updatedAt: new Date().toISOString()
    };
    transaction.set(userRef, expiredState, { merge: true });
    const error = new Error('trial_expired');
    error.code = 'trial_expired';
    error.state = expiredState;
    throw error;
  });
}

export async function loadUserDocument(uid) {
  const snapshot = await getDoc(doc(db, 'users', uid));
  return snapshot.exists() ? snapshot.data() : {};
}

export async function loadHistory(uid) {
  const data = await loadUserDocument(uid);
  return sanitizeStoredHistory(data?.history);
}

export async function saveAudit(uid, record, localHistory = []) {
  const userRef = doc(db, 'users', uid);
  const snapshot = await getDoc(userRef);
  const cloudHistory = snapshot.exists() ? sanitizeStoredHistory(snapshot.data()?.history) : [];
  const history = mergeHistoryRecords([record], cloudHistory, localHistory);
  await setDoc(userRef, { history, updatedAt: new Date().toISOString() }, { merge: true });
  return history;
}

export async function acceptLegal(uid, acceptance) {
  await setDoc(doc(db, 'users', uid), { legalAcceptance: acceptance, updatedAt: new Date().toISOString() }, { merge: true });
}

export async function syncProfile(uid, profile) {
  await setDoc(doc(db, 'users', uid), { profile, updatedAt: new Date().toISOString() }, { merge: true });
}

export async function uploadAgencyLogo(uid, file) {
  const logoRef = ref(storage, `users/${uid}/agency-logo/${file.name}`);
  await uploadBytes(logoRef, file);
  return getDownloadURL(logoRef);
}
