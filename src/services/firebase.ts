import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyAftWQ1JUbz7789au8Xij8_Xn2rC5Bq15k",
    authDomain: "campusfinder-e8db4.firebaseapp.com",
    projectId: "campusfinder-e8db4",
    storageBucket: "campusfinder-e8db4.firebasestorage.app",
    messagingSenderId: "783195643305",
    appId: "1:783195643305:web:ddc0441e9b9256d65eb8b8",
    measurementId: "G-1CN7W4DMHE"
};

//initialize firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore();
const storage = getStorage();
const auth = getAuth();
const analytics = getAnalytics();

export { app, db, auth, storage, analytics };