import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAuV8Pp9YAS4moFT1jb2_hB7ENepqdFGss",
  authDomain: "anareq-app.firebaseapp.com",
  projectId: "anareq-app",
  storageBucket: "anareq-app.firebasestorage.app",
  messagingSenderId: "826887853214",
  appId: "1:826887853214:web:d4b0c495daacc4a740578f",
  measurementId: "G-BDS18SR8NR"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);

googleProvider.setCustomParameters({
  prompt: 'select_account'
});