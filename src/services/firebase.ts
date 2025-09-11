import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
import Constants from "expo-constants";

const extra =
    (Constants.expoConfig?.extra as Record<string, string>) ||
    (Constants.manifest?.extra as Record<string, string>) ||
    {};

if (!extra.FIREBASE_API_KEY) {
    throw new Error("Missing Firebase config values. Check your app.config.ts extra section.");
}

const firebaseConfig = {
    apiKey: extra.FIREBASE_API_KEY,
    authDomain: extra.AUTH_DOMAIN,
    projectId: extra.PROJECT_ID,
    storageBucket: extra.STORAGE_BUCKET,
    messagingSenderId: extra.MESSAGING_SENDER_ID,
    appId: extra.APP_ID,
    measurementId: extra.MEASUREMENT_ID,
};
console.log(" Firebase config:", firebaseConfig);

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);



export { app, db, auth, storage };
