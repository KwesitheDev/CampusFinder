import React from 'react';
import { StyleSheet, TextInput, Text, View } from 'react-native';
import { COLORS } from '../utils/constants';

interface FormInputProps {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    secureTextEntry?: boolean;
    error?: string;
}

const FormInput: React.FC<FormInputProps> = ({
    label,
    value,
    onChangeText,
    placeholder,
    secureTextEntry,
    error,
}) => {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>
            <TextInput
                style={[styles.input, error ? styles.inputError : null]}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                secureTextEntry={secureTextEntry}
                autoCapitalize="none"
            />
            {error ? <Text style={styles.error}>{error}</Text> : null}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 15,
    },
    label: {
        fontSize: 16,
        color: COLORS.text,
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: COLORS.text,
        borderRadius: 5,
        padding: 10,
        fontSize: 16,
        backgroundColor: '#fff',
    },
    inputError: {
        borderColor: COLORS.error,
    },
    error: {
        color: COLORS.error,
        fontSize: 14,
        marginTop: 5,
    },
});

export default FormInput;