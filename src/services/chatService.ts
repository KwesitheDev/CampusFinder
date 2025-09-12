
import { collection, addDoc, query, orderBy, onSnapshot, where } from 'firebase/firestore';
import { db } from './firebase';
import { Message, Chat } from '../types';

export const createChat = async (userId1: string, userId2: string, itemId: string): Promise<Chat> => {
    try {
        // Check if chat already exists
        const chatsQuery = query(
            collection(db, 'chats'),
            where('participants', 'array-contains', userId1)
        );
        const querySnapshot = await getDocs(chatsQuery);
        let existingChat: Chat | null = null;
        querySnapshot.forEach((doc) => {
            const chat = { id: doc.id, ...doc.data() } as Chat;
            if (chat.participants.includes(userId2) && chat.itemId === itemId) {
                existingChat = chat;
            }
        });

        if (existingChat) return existingChat;

        // Create new chat
        const docRef = await addDoc(collection(db, 'chats'), {
            participants: [userId1, userId2],
            itemId,
            createdAt: new Date().toISOString(),
        });

        return { id: docRef.id, participants: [userId1, userId2], itemId };
    } catch (error: any) {
        throw new Error(error.message || 'Failed to create chat');
    }
};

export const sendMessage = async (chatId: string, senderId: string, text: string): Promise<Message> => {
    try {
        const docRef = await addDoc(collection(db, `chats/${chatId}/messages`), {
            senderId,
            text,
            createdAt: new Date().toISOString(),
        });

        return { id: docRef.id, chatId, senderId, text, createdAt: new Date().toISOString() };
    } catch (error: any) {
        throw new Error(error.message || 'Failed to send message');
    }
};

export const listenToMessages = (
    chatId: string,
    callback: (messages: Message[]) => void
): (() => void) => {
    const q = query(collection(db, `chats/${chatId}/messages`), orderBy('createdAt', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
        const messages: Message[] = [];
        snapshot.forEach((doc) => {
            messages.push({ id: doc.id, chatId, ...doc.data() } as Message);
        });
        callback(messages);
    });
    return unsubscribe;
};