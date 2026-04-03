import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAnfjj8AI701zYc-qznGvmyGRwZy5apqqA",
  authDomain: "my-medicine-route.firebaseapp.com",
  projectId: "my-medicine-route",
  storageBucket: "my-medicine-route.firebasestorage.app",
  messagingSenderId: "796187830213",
  appId: "1:796187830213:web:fae4934244a1b32caf0dac"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;