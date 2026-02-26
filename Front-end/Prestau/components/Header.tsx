import React from 'react';
import { View, StyleSheet, Image, useWindowDimensions } from 'react-native';
import { useThemeColors } from '@/hooks/useThemeColors';

type Props = {
    title?: string,
    onPress?: () => void,
    style?: any
}

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

const baseImageStyle = {
    alignSelf: "center" as const, // Type assertion to satisfy the type requirement
    justifyContent: "center" as const, // Type assertion to satisfy the type requirement
}