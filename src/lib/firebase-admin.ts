import * as admin from 'firebase-admin';

// =================================================================================
// IMPORTANT - CONFIGURE FIREBASE ADMIN SDK
// =================================================================================
// To initialize the Firebase Admin SDK, you need to provide your service account
// credentials. It's recommended to use environment variables for this.
//
// 1. Go to your Firebase project console.
// 2. Click the gear icon > "Project settings" > "Service accounts".
// 3. Click "Generate new private key" and download the JSON file.
//
// 4. Set the following environment variables in a `.env.local` file.
//    You can copy the values directly from the downloaded JSON file.
//
//    FIREBASE_PROJECT_ID="your-project-id"
//    FIREBASE_CLIENT_EMAIL="your-client-email"
//    FIREBASE_PRIVATE_KEY="your-private-key"
//
//    NOTE: For the `FIREBASE_PRIVATE_KEY`, you need to format it correctly
//    since it's a multi-line key. In your `.env.local` file, you can
//    wrap the key in double quotes and replace newlines with `\n`.
//    Example: FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
//
// =================================================================================

const serviceAccount: admin.ServiceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const firestore = admin.firestore();
const auth = admin.auth();

export { admin, firestore, auth };
