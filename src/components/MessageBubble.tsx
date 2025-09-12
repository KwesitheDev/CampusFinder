import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Message } from '../types';
import { COLORS } from '../utils/constants';

interface MessageBubbleProps {
    message: Message;
    isSender: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isSender }) => {
    return (
        <View style={[styles.container, isSender ? styles.sender : styles.receiver]}>
            <Text style={styles.text}>{message.text}</Text>
            <Text style={styles.timestamp}>{new Date(message.createdAt).toLocaleTimeString()}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        maxWidth: '80%',
        padding: 10,
        borderRadius: 10,
        marginVertical: 5,
    },
    sender: {
        backgroundColor: COLORS.primary,
        alignSelf: 'flex-end',
        marginRight: 10,
    },
    receiver: {
        backgroundColor: '#e5e5ea',
        alignSelf: 'flex-start',
        marginLeft: 10,
    },
    text: {
        fontSize: 16,
        color: COLORS.text,
    },
    timestamp: {
        fontSize: 12,
        color: '#666',
        marginTop: 5,
    },
});

export default MessageBubble;