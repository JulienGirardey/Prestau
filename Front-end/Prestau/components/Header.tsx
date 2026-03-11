import React from 'react';
import { View, StyleSheet, Image, useWindowDimensions } from 'react-native';
import { useThemeColors } from '@/hooks/useThemeColors';

// Props du composant Header
type Props = { 
    title?: string,
    onPress?: () => void,
    style?: any
}

// Composant de header personnalisé, affichant le logo de l'application et pouvant être stylisé via les props
export function Header({ title = "Header", onPress, style }: Props) {
    const colors = useThemeColors();
    const { width, height } = useWindowDimensions();
    return (
        <View style={[styles.headerContainer, { height: Math.min(height * 0.25, 135) }, { backgroundColor: colors.primary, borderColor: colors.secondary }]}>
            <Image style={[baseImageStyle, { borderColor: colors.secondary, width: Math.min(80, width * 0.25), height: Math.min(80, width * 0.25) }]} source={require('@/assets/images/logo-prestau.jpg')} />
            <View style={{ flex: 0.2 }} />
        </View>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        justifyContent: 'flex-end',
        alignItems: 'center',
        borderBottomWidth: 4,
    }
});

// Style de base pour l'image du logo, utilisé dans le header et les écrans de login/register
const baseImageStyle = {
    alignSelf: "center" as const, // Centrer horizontalement l'image
    justifyContent: "center" as const, // Centrer verticalement l'image
}
