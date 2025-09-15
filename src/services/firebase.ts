import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";
// @ts-ignore
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";

const extra =
    (Constants.expoConfig?.extra as Record<string, string>) ||
    (Constants.manifest?.extra as Record<string, string>) ||
    {};

if (!extra.FIREBASE_API_KEY) {
    throw new Error(
        "Missing Firebase config values. Check your app.config.ts extra section."
    );
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

console.log("Firebase config:", firebaseConfig);

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Auth with persistence for React Native
const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
});

const db = getFirestore(app);
const storage = getStorage(app);

let analytics: ReturnType<typeof getAnalytics> | undefined;
try {
    analytics = getAnalytics(app);
} catch {
    console.log("Analytics is only supported on web.");
}

export { app, auth, db, storage, analytics };
