import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup,
  signInWithEmailAndPassword, createUserWithEmailAndPassword,
  sendPasswordResetEmail, signOut as firebaseSignOut
} from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
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
