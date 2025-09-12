import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "./firebase";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

export const setupNotifications = async (userId: string): Promise<string | null> => {
    try {
        // Request notification permissions
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== "granted") {
            console.log("Notification permissions not granted");
            return null;
        }

        // Get push token
        if (Platform.OS === "android") {
            await Notifications.setNotificationChannelAsync("default", {
                name: "default",
                importance: Notifications.AndroidImportance.MAX,
            });
        }
        const token = (await Notifications.getExpoPushTokenAsync()).data;

        // Save token to Firestore
        await setDoc(
            doc(db, "users", userId),
            { pushToken: token },
            { merge: true }
        );

        return token;
    } catch (error: any) {
        console.error("Failed to set up notifications:", error);
        return null;
    }
};

export const sendPushNotification = async (
    toUserId: string,
    title: string,
    body: string
) => {
    try {
        // ✅ Fetch user’s push token correctly with getDoc
        const userDocRef = doc(db, "users", toUserId);
        const userDocSnap = await getDoc(userDocRef);

        if (!userDocSnap.exists()) {
            console.log("User not found:", toUserId);
            return;
        }

        const userData = userDocSnap.data();
        if (!userData?.pushToken) {
            console.log("No push token for user:", toUserId);
            return;
        }

        // Send notification via Expo’s push API
        const response = await fetch("https://exp.host/--/api/v2/push/send", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                to: userData.pushToken,
                title,
                body,
            }),
        });

        if (!response.ok) {
            console.error(
                "Failed to send push notification:",
                await response.text()
            );
        }
    } catch (error: any) {
        console.error("Error sending push notification:", error);
    }
};
