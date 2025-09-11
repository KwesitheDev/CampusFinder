import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    User as FirebaseUser
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import { User } from '../types';
import { STUDENT_ID_REGEX } from '../utils/constants';

export const signup = async (email: string, password: string, studentId: string): Promise<User> => {
    try {
        // Validate student ID format
        if (!STUDENT_ID_REGEX.test(studentId)) {
            throw new Error('Invalid student ID. Must be exactly 10 digits (e.g., 1234567890)');
        }

        // Create user with email/password
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const firebaseUser = userCredential.user;

        // Store student ID in Firestore
        await setDoc(doc(db, 'users', firebaseUser.uid), {
            email: firebaseUser.email,
            studentId,
        });

        return { uid: firebaseUser.uid, email: firebaseUser.email!, studentId };
    } catch (error: any) {
        throw new Error(error.message || 'Signup failed');
    }
};

export const login = async (email: string, password: string): Promise<User> => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const firebaseUser = userCredential.user;

        // Fetch user data from Firestore
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        const userData = userDoc.data();
        if (!userData) throw new Error('User data not found');

        return { uid: firebaseUser.uid, email: firebaseUser.email!, studentId: userData.studentId };
    } catch (error: any) {
        throw new Error(error.message || 'Login failed');
    }
};

export const logout = async (): Promise<void> => {
    try {
        await signOut(auth);
    } catch (error: any) {
        throw new Error(error.message || 'Logout failed');
    }
};

export const getCurrentUser = (callback: (user: User | null) => void) => {
    return onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
        if (firebaseUser) {
            const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
            const userData = userDoc.data();
            if (userData) {
                callback({ uid: firebaseUser.uid, email: firebaseUser.email!, studentId: userData.studentId });
            } else {
                callback(null);
            }
        } else {
            callback(null);
        }
    });
};
