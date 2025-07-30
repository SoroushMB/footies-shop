
// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// =================================================================================
// IMPORTANT - PASTE YOUR FIREBASE CONFIGURATION HERE
// =================================================================================
// 1. Go to your Firebase project console.
// 2. In the left-hand menu, click the gear icon next to "Project Overview".
// 3. Click "Project settings".
// 4. In the "Your apps" card, select your web app.
// 5. Under "Firebase SDK snippet", select the "Config" radio button.
// 6. Copy the entire 'firebaseConfig' object and paste it below, replacing
//    the placeholder object.
// 7. For more detailed instructions, see the `firebase-instructions.md` file
//    in the root of your project.
// =================================================================================

const firebaseConfig = {
  // PASTE YOUR CONFIG OBJECT HERE
  apiKey: "REPLACE_WITH_YOUR_API_KEY",
  authDomain: "REPLACE_WITH_YOUR_AUTH_DOMAIN",
  projectId: "REPLACE_WITH_YOUR_PROJECT_ID",
  storageBucket: "REPLACE_WITH_YOUR_STORAGE_BUCKET",
  messagingSenderId: "REPLACE_WITH_YOUR_MESSAGING_SENDER_ID",
  appId: "REPLACE_WITH_YOUR_APP_ID"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
