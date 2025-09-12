import React, { useState } from 'react';
import { StyleSheet, View, Text, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as ImagePicker from 'expo-image-picker';
import FormInput from '../components/FormInput';
import Button from '../components/Button';
import { reportItem } from '../services/itemService';
import { COLORS } from '../utils/constants';
import { getCurrentUser } from '../services/authService';

type RootStackParamList = {
    Login: undefined;
    Signup: undefined;
    Home: undefined;
    ReportLost: undefined;
    ReportFound: undefined;
    Search: undefined;
};

type ReportLostScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ReportLost'>;

const ReportLostScreen: React.FC = () => {
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [photoUri, setPhotoUri] = useState<string | undefined>();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation<ReportLostScreenNavigationProp>();

    const pickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
            Alert.alert('Permission required', 'Please allow access to your photo library.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled && result.assets[0].uri) {
            setPhotoUri(result.assets[0].uri);
        }
    };

    const handleSubmit = async () => {
        setError(null);
        setLoading(true);
        try {
            const user = await new Promise<User | null>((resolve) => {
                getCurrentUser(resolve);
            });
            if (!user) throw new Error('User not authenticated');

            await reportItem(user.uid, 'lost', category, description, location, photoUri);
            Alert.alert('Success', 'Lost item reported successfully');
            navigation.navigate('Home');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Report Lost Item</Text>
            <FormInput
                label="Category"
                value={category}
                onChangeText={setCategory}
                placeholder="e.g., Wallet, Phone"
            />
            <FormInput
                label="Description"
                value={description}
                onChangeText={setDescription}
                placeholder="Describe the item"
            />
            <FormInput
                label="Location"
                value={location}
                onChangeText={setLocation}
                placeholder="Where was it lost?"
            />
            <Button title="Pick Image" onPress={pickImage} />
            {photoUri && <Text style={styles.photoText}>Image selected</Text>}
            {error && <Text style={styles.error}>{error}</Text>}
            <Button title="Submit" onPress={handleSubmit} disabled={loading} />
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
    photoText: {
        fontSize: 16,
        color: COLORS.success,
        marginBottom: 10,
        textAlign: 'center',
    },
});

export default ReportLostScreen;