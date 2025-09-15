import "dotenv/config";
import { ExpoConfig, ConfigContext } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
    ...config,
    name: "CampusFinder",
    slug: "campusfinder",
    version: "1.0.0",
    orientation: "portrait",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    splash: {
        image: "./assets/splash-icon.png",
        resizeMode: "contain",
        backgroundColor: "#ffffff",
    },
    ios: {
        supportsTablet: true,
        bundleIdentifier: "com.yourname.campusfinder",
        infoPlist: {
            NSPhotoLibraryUsageDescription:
                "Allow CampusFinder to access your photo library to upload item photos.",
            NSPhotoLibraryAddUsageDescription:
                "Allow CampusFinder to save photos to your library.",
            UIBackgroundModes: ["remote-notification"],
        },
    },
    android: {
        package: "com.yourname.campusfinder",
        adaptiveIcon: {
            foregroundImage: "./assets/adaptive-icon.png",
            backgroundColor: "#ffffff",
        },
        edgeToEdgeEnabled: true,
        predictiveBackGestureEnabled: false,
        permissions: [
            "NOTIFICATIONS", // s allow notifications
        ],
    },
    web: {
        favicon: "./assets/favicon.png",
    },
    extra: {
        FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
        AUTH_DOMAIN: process.env.AUTH_DOMAIN,
        PROJECT_ID: process.env.PROJECT_ID,
        STORAGE_BUCKET: process.env.STORAGE_BUCKET,
        MESSAGING_SENDER_ID: process.env.MESSAGING_SENDER_ID,
        APP_ID: process.env.APP_ID,
        MEASUREMENT_ID: process.env.MEASUREMENT_ID,

    },
});
