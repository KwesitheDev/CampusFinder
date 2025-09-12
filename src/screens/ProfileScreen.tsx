import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Button from '../components/Button';
import { createChat } from '../services/chatService';
import { COLORS } from '../utils/constants';
import { getCurrentUser } from '../services/authService';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebase';

type RootStackParamList = {
    Login: undefined;
    Signup: undefined;
    Home: undefined;
    ReportLost: undefined;
    ReportFound: undefined;
    Search: undefined;
    Chat: { chatId: string; recipientId: string };
    Profile: { userId: string; itemId: string };
};

type ProfileScreenRouteProp = RouteProp<RootStackParamList, 'Profile'>;
type ProfileScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Profile'>;

const ProfileScreen: React.FC = () => {
    const [userData, setUserData] = useState<{ email: string; studentId: string } | null>(null);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const route = useRoute<ProfileScreenRouteProp>();
    const navigation = useNavigation<ProfileScreenNavigationProp>();
    const { userId, itemId } = route.params;

    useEffect(() => {
        // Get current user
        getCurrentUser((user) => {
            setCurrentUserId(user?.uid || null);
        });

        // Fetch user data
        const fetchUserData = async () => {
            try {
                const userDoc = await getDoc(doc(db, 'users', userId));
                if (userDoc.exists()) {
                    setUserData(userDoc.data() as { email: string; studentId: string });
                }
            } catch (error: any) {
                console.error('Failed to fetch user data:', error);
            }
        };
        fetchUserData();
    }, [userId]);

    const handleStartChat = async () => {
        if (!currentUserId) {
            Alert.alert('Error', 'You must be logged in to start a chat');
            return;
        }
        try {
            const chat = await createChat(currentUserId, userId, itemId);
            navigation.navigate('Chat', { chatId: chat.id, recipientId: userId });
        } catch (error: any) {
            Alert.alert('Error', error.message);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>User Profile</Text>
            {userData ? (
                <>
                    <Text style={styles.info}>Email: {userData.email}</Text>
                    <Text style={styles.info}>Student ID: {userData.studentId}</Text>
                    <Button title="Start Chat" onPress={handleStartChat} />
                </>
            ) : (
                <Text style={styles.info}>Loading user data...</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: COLORS.background,
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 20,
        textAlign: 'center',
    },
    info: {
        fontSize: 18,
        color: COLORS.text,
        marginBottom: 10,
    },
});

export default ProfileScreen;