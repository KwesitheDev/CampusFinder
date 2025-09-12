import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput, FlatList, Text } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';
import { sendMessage, listenToMessages } from '../services/chatService';
import MessageBubble from '../components/MessageBubble';
import Button from '../components/Button';
import { COLORS } from '../utils/constants';
import { Message } from '../types';
import { getCurrentUser } from '../services/authService';

type RootStackParamList = {
    Login: undefined;
    Signup: undefined;
    Home: undefined;
    ReportLost: undefined;
    ReportFound: undefined;
    Search: undefined;
    Chat: { chatId: string; recipientId: string };
    Profile: { userId: string };
};

type ChatScreenRouteProp = RouteProp<RootStackParamList, 'Chat'>;

const ChatScreen: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [text, setText] = useState('');
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const route = useRoute<ChatScreenRouteProp>();
    const { chatId } = route.params;

    useEffect(() => {
        // Get current user
        getCurrentUser((user) => {
            setCurrentUserId(user?.uid || null);
        });

        // Listen to messages
        const unsubscribe = listenToMessages(chatId, setMessages);
        return unsubscribe;
    }, [chatId]);

    const handleSend = async () => {
        if (!text.trim() || !currentUserId) return;
        try {
            await sendMessage(chatId, currentUserId, text.trim());
            setText('');
        } catch (error: any) {
            console.error('Failed to send message:', error);
        }
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={messages}
                renderItem={({ item }) => (
                    <MessageBubble message={item} isSender={item.senderId === currentUserId} />
                )}
                keyExtractor={(item) => item.id}
                style={styles.messageList}
            />
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={text}
                    onChangeText={setText}
                    placeholder="Type a message..."
                />
                <Button title="Send" onPress={handleSend} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    messageList: {
        flex: 1,
        padding: 10,
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 10,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: COLORS.text,
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: COLORS.text,
        borderRadius: 5,
        padding: 10,
        marginRight: 10,
        fontSize: 16,
    },
});

export default ChatScreen;