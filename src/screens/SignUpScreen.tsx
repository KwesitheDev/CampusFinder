import React, { useState } from 'react';
import { StyleSheet, View, Text, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import FormInput from '../components/FormInput';
import Button from '../components/Button';
import { signup } from '../services/authService';
import { COLORS, STUDENT_ID_REGEX } from '../utils/constants';

type RootStackParamList = {
    Login: undefined;
    Signup: undefined;
    Home: undefined;
};

type SignupScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Signup'>;

const SignupScreen: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [studentId, setStudentId] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation<SignupScreenNavigationProp>();

    const handleSignup = async () => {
        setError(null);
        setLoading(true);
        if (!STUDENT_ID_REGEX.test(studentId)) {
            setError('Invalid student ID. Must be format 1234567890');
            setLoading(false);
            return;
        }
        try {
            await signup(email, password, studentId);
            navigation.navigate('Home');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Sign Up</Text>
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
            <FormInput
                label="Student ID"
                value={studentId}
                onChangeText={setStudentId}
                placeholder="e.g., 1234567890"
            />
            {error && <Text style={styles.error}>{error}</Text>}
            <Button title="Sign Up" onPress={handleSignup} disabled={loading} />
            <Button
                title="Already have an account? Login"
                onPress={() => navigation.navigate('Login')}
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

export default SignupScreen;