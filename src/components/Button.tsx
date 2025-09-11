import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { COLORS } from '../utils/constants';

interface ButtonProps {
    title: string;
    onPress: () => void;
    disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ title, onPress, disabled }) => {
    return (
        <TouchableOpacity
            style={[styles.button, disabled ? styles.buttonDisabled : null]}
            onPress={onPress}
            disabled={disabled}
        >
            <Text style={styles.buttonText}>{title}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: COLORS.primary,
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginVertical: 10,
    },
    buttonDisabled: {
        backgroundColor: '#ccc',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default Button;