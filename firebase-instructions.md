# How to Add Your Firebase Configuration

To get your app connected to Firebase, you need to add your project's unique configuration keys to the code.

Follow these steps to find your Firebase config object:

## 1. Open Your Firebase Project

Go to the [Firebase Console](https://console.firebase.google.com/) and select the project you are using for this application.

## 2. Navigate to Project Settings

In the left-hand sidebar, click the **Gear icon** next to **Project Overview**, then select **Project settings**.

![Step 2: Project Settings](https://storage.googleapis.com/studioprompt/google-internal-testing/firebase-config-instructions/step2.png)

## 3. Find Your Web App

In the main Project settings page, scroll down to the **Your apps** card. Click on the name of your web app (it usually has a `</>` icon).

![Step 3: Your Apps](https://storage.googleapis.com/studioprompt/google-internal-testing/firebase-config-instructions/step3.png)

## 4. Copy the `firebaseConfig` Object

In the app settings, find the **Firebase SDK snippet** section and make sure the **Config** radio button is selected.

This will display a code block containing the `firebaseConfig` object. This object contains your project's unique, public-safe keys.

![Step 4: Copy Config](https://storage.googleapis.com/studioprompt/google-internal-testing/firebase-config-instructions/step4.png)

## 5. Paste the Config into Your Code

Copy the entire `firebaseConfig` object, from the opening `{` to the closing `}`.

Open the file `src/lib/firebase.ts` in your editor.

Replace the placeholder `firebaseConfig` object with the one you just copied from the Firebase Console.

### Before:
```typescript
const firebaseConfig = {
  // PASTE YOUR CONFIG OBJECT HERE
  apiKey: "REPLACE_WITH_YOUR_API_KEY",
  authDomain: "REPLACE_WITH_YOUR_AUTH_DOMAIN",
  // ... and so on
};
```

### After (Example):
```typescript
const firebaseConfig = {
  apiKey: "AIzaSyA...your...key...",
  authDomain: "your-project-12345.firebaseapp.com",
  projectId: "your-project-12345",
  storageBucket: "your-project-12345.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890abcd"
};
```

Once you have pasted your unique configuration, the application will be able to connect to your Firebase project, and the authentication errors will be resolved.
