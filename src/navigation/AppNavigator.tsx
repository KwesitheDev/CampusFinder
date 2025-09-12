import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import HomeScreen from '../screens/HomeScreen';
import ReportLostScreen from '../screens/ReportLostScreen';
import ReportFoundScreen from '../screens/ReportFoundScreen';
import SearchScreen from '../screens/SearchScreen';
import ChatScreen from '../screens/ChatScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { getCurrentUser } from '../services/authService';
import { User } from '../types';

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

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = getCurrentUser((currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    if (loading) {
        return null;
    }

    return (
        <NavigationContainer>
            <Stack.Navigator>
                {user ? (
                    <>
                        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
                        <Stack.Screen name="ReportLost" component={ReportLostScreen} options={{ title: 'Report Lost Item' }} />
                        <Stack.Screen name="ReportFound" component={ReportFoundScreen} options={{ title: 'Report Found Item' }} />
                        <Stack.Screen name="Search" component={SearchScreen} options={{ title: 'Search Items' }} />
                        <Stack.Screen name="Chat" component={ChatScreen} options={{ title: 'Chat' }} />
                        <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'User Profile' }} />
                    </>
                ) : (
                    <>
                        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
                        <Stack.Screen name="Signup" component={SignupScreen} options={{ headerShown: false }} />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;