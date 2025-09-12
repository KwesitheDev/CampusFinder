import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { Item } from '../types';
import { COLORS } from '../utils/constants';

interface ItemCardProps {
    item: Item;
    onPress?: () => void;
}

const ItemCard: React.FC<ItemCardProps> = ({ item, onPress }) => {
    return (
        <TouchableOpacity style={styles.card} onPress={onPress}>
            {item.photoUrl && <Image source={{ uri: item.photoUrl }} style={styles.image} />}
            <Text style={styles.title}>{item.category}</Text>
            <Text style={styles.description}>{item.description}</Text>
            <Text style={styles.location}>Location: {item.location}</Text>
            <Text style={styles.date}>Posted: {new Date(item.createdAt).toLocaleDateString()}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 15,
        marginVertical: 8,
        marginHorizontal: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    image: {
        width: '100%',
        height: 150,
        borderRadius: 8,
        marginBottom: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 5,
    },
    description: {
        fontSize: 16,
        color: COLORS.text,
        marginBottom: 5,
    },
    location: {
        fontSize: 14,
        color: COLORS.text,
        marginBottom: 5,
    },
    date: {
        fontSize: 12,
        color: COLORS.text,
    },
});

export default ItemCard;