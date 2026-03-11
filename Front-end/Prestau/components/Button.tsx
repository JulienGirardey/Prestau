import React from 'react';
import { View, StyleSheet, Button } from 'react-native';
import { useThemeColors } from '@/hooks/useThemeColors';

// Props du composant NewButton
type Props = {
    title?: string,
    onPress?: () => void,
    style?: any,
    disabled?: boolean
}

// Composant de bouton personnalisé, stylisé pour s'intégrer à l'esthétique de l'application
export function NewButton({ title = "Button", onPress, style, disabled }: Props) {
    const colors = useThemeColors();
    return ( // Utilisation du composant Button de React Native, encapsulé dans une View pour appliquer le style personnalisé
        <View style={[styles.buttonContainer, style]}>
            <Button title={title} onPress={onPress} color={colors.background} disabled={disabled}/>
        </View>
    );
}

const styles = StyleSheet.create({
    buttonContainer: {
        width: "100%",
        height: 43,
        backgroundColor: '#EE4832',
        borderRadius: 15,
        justifyContent: 'center',
    }
});
