import { collection, addDoc, query, where, getDocs, orderBy } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { logEvent, getAnalytics } from 'firebase/analytics';
import { db, storage, app } from './firebase';
import { Item } from '../types';
import { sendPushNotification } from './notificationService';

export const reportItem = async (
    userId: string,
    type: 'lost' | 'found',
    category: string,
    description: string,
    location: string,
    photoUri?: string
): Promise<Item> => {
    try {
        // Validate inputs
        if (!category || !description || !location) {
            throw new Error('Category, description, and location are required');
        }

        let photoUrl: string | undefined;

        if (photoUri) {
            const response = await fetch(photoUri);
            const blob = await response.blob();
            const photoRef = ref(storage, `items/${userId}/${Date.now()}.jpg`);
            await uploadBytes(photoRef, blob);
            photoUrl = await getDownloadURL(photoRef);
        }

        const docRef = await addDoc(collection(db, 'items'), {
            userId,
            type,
            category,
            description,
            location,
            photoUrl,
            createdAt: new Date().toISOString(),
        });

        // Log analytics event
        const analytics = getAnalytics(app);
        logEvent(analytics, `report_${type}_item`, { category, location });

        // Check for potential matches
        const oppositeType = type === 'lost' ? 'found' : 'lost';
        const matchQuery = query(
            collection(db, 'items'),
            where('type', '==', oppositeType),
            where('category', '==', category)
        );
        const querySnapshot = await getDocs(matchQuery);
        querySnapshot.forEach((doc) => {
            const matchedItem = doc.data();
            sendPushNotification(
                matchedItem.userId,
                `Potential ${type} Item Match`,
                `A ${type} item (${category}) was reported that may match your ${oppositeType} item.`
            );
        });

        return { id: docRef.id, userId, type, category, description, location, photoUrl, createdAt: new Date().toISOString() };
    } catch (error: any) {
        throw new Error(error.message || 'Failed to report item');
    }
};

export const searchItems = async (type: 'lost' | 'found', searchTerm?: string): Promise<Item[]> => {
    try {
        const q = query(collection(db, 'items'), where('type', '==', type), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        let items: Item[] = [];
        querySnapshot.forEach((doc) => {
            items.push({ id: doc.id, ...doc.data() } as Item);
        });

        if (searchTerm) {
            const lowerSearchTerm = searchTerm.toLowerCase();
            items = items.filter(
                (item) =>
                    item.category.toLowerCase().includes(lowerSearchTerm) ||
                    item.description.toLowerCase().includes(lowerSearchTerm) ||
                    item.location.toLowerCase().includes(lowerSearchTerm)
            );
        }

        return items;
    } catch (error: any) {
        throw new Error(error.message || 'Failed to search items');
    }
};