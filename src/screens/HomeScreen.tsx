import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Button from '../components/Button';
import { logout } from '../services/authService';
import { COLORS } from '../utils/constants';

type RootStackParamList = {
    Login: undefined;
    Signup: undefined;
    Home: undefined;
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

    return (
        <View style={styles.container}>
            <Text style={styles.title}>CampusFinder Dashboard</Text>
            <Text style={styles.subtitle}>Welcome! You are logged in.</Text>
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