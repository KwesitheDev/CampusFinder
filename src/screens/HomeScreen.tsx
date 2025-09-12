import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Button from '../components/Button';
import { logout } from '../services/authService';
import { COLORS } from '../utils/constants';
import { getCurrentUser } from '../services/authService';

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

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen: React.FC = () => {
    const navigation = useNavigation<HomeScreenNavigationProp>();

    const handleLogout = async () => {
        try {
            await logout();
            navigation.navigate('Login');
        } catch (err: any) {
            console.error(err.message);
        }
    };

    const handleViewProfile = () => {
        getCurrentUser((user) => {
            if (user) {
                navigation.navigate('Profile', { userId: user.uid, itemId: '' });
            }
        });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>CampusFinder Dashboard</Text>
            <Text style={styles.subtitle}>Welcome! You are logged in.</Text>
            <Button title="Report Lost Item" onPress={() => navigation.navigate('ReportLost')} />
            <Button title="Report Found Item" onPress={() => navigation.navigate('ReportFound')} />
            <Button title="Search Items" onPress={() => navigation.navigate('Search')} />
            <Button title="View Profile" onPress={handleViewProfile} />
            <Button title="Logout" onPress={handleLogout} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: COLORS.background,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 18,
        color: COLORS.text,
        marginBottom: 20,
    },
});

export default HomeScreen;