import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, TextInput } from 'react-native';
import { COLORS } from '../utils/constants';
import { searchItems } from '../services/itemService';
import ItemCard from '../components/ItemCard';
import { Item } from '../types';

const SearchScreen: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [lostItems, setLostItems] = useState<Item[]>([]);
    const [foundItems, setFoundItems] = useState<Item[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const lost = await searchItems('lost', searchTerm);
                const found = await searchItems('found', searchTerm);
                setLostItems(lost);
                setFoundItems(found);
            } catch (err: any) {
                setError(err.message);
            }
        };
        fetchItems();
    }, [searchTerm]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Search Items</Text>
            <TextInput
                style={styles.searchInput}
                placeholder="Search by description..."
                value={searchTerm}
                onChangeText={setSearchTerm}
            />
            {error && <Text style={styles.error}>{error}</Text>}
            <Text style={styles.sectionTitle}>Lost Items</Text>
            <FlatList
                data={lostItems}
                renderItem={({ item }) => <ItemCard item={item} />}
                keyExtractor={(item) => item.id}
                ListEmptyComponent={<Text style={styles.empty}>No lost items found</Text>}
            />
            <Text style={styles.sectionTitle}>Found Items</Text>
            <FlatList
                data={foundItems}
                renderItem={({ item }) => <ItemCard item={item} />}
                keyExtractor={(item) => item.id}
                ListEmptyComponent={<Text style={styles.empty}>No found items found</Text>}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: COLORS.background,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 20,
        textAlign: 'center',
    },
    searchInput: {
        borderWidth: 1,
        borderColor: COLORS.text,
        borderRadius: 5,
        padding: 10,
        fontSize: 16,
        backgroundColor: '#fff',
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.text,
        marginVertical: 10,
    },
    empty: {
        fontSize: 16,
        color: COLORS.text,
        textAlign: 'center',
        marginVertical: 10,
    },
    error: {
        color: COLORS.error,
        marginBottom: 10,
        textAlign: 'center',
    },
});

export default SearchScreen;