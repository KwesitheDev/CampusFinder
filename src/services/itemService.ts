import { collection, addDoc, query, where, getDocs, orderBy } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './firebase';
import { Item } from '../types';

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
            // Upload photo to Firebase Storage
            const response = await fetch(photoUri);
            const blob = await response.blob();
            const photoRef = ref(storage, `items/${userId}/${Date.now()}.jpg`);
            await uploadBytes(photoRef, blob);
            photoUrl = await getDownloadURL(photoRef);
        }

        // Save item to Firestore
        const docRef = await addDoc(collection(db, 'items'), {
            userId,
            type,
            category,
            description,
            location,
            photoUrl,
            createdAt: new Date().toISOString(),
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

        // Client-side filtering for search term
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