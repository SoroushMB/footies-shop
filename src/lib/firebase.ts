// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  projectId: 'apex-football-gear',
  appId: '1:379835825888:web:13e28f6f67c7c57d999a85',
  storageBucket: 'apex-football-gear.firebasestorage.app',
  apiKey: 'AIzaSyCeKvXLN91wumXsA3M3mQj0JP_EAsTx8IM',
  authDomain: 'apex-football-gear.firebaseapp.com',
  messagingSenderId: '379835825888',
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
