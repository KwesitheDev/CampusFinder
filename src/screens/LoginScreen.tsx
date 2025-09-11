import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import FormInput from '../components/FormInput';
import Button from '../components/Button';
import { login } from '../services/authService';
import { COLORS } from '../utils/constants';

type RootStackParamList = {
    Login: undefined;
    Signup: undefined;
    Home: undefined;
};

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

const LoginScreen: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation<LoginScreenNavigationProp>();

    const handleLogin = async () => {
        setError(null);
        setLoading(true);
        try {
            await login(email, password);
            navigation.navigate('Home');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>
            <FormInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
            />
            <FormInput
                label="Password"
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                secureTextEntry
            />
            {error && <Text style={styles.error}>{error}</Text>}
            <Button title="Login" onPress={handleLogin} disabled={loading} />
            <Button
                title="Don't have an account? Sign Up"
                onPress={() => navigation.navigate('Signup')}
            />
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
    error: {
        color: COLORS.error,
        marginBottom: 10,
        textAlign: 'center',
    },
});

export default LoginScreen;