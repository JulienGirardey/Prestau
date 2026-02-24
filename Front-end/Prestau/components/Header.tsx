import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { useThemeColors } from '@/hooks/useThemeColors';

type Props = {
    title?: string,
    onPress?: () => void,
    style?: any
}

export function Header({ title = "Button", onPress, style }: Props) {
    const colors = useThemeColors();
    return (
        <View style={[styles.headerContainer, style, { backgroundColor: colors.primary, borderColor: colors.secondary }]}>
            <Image style={[baseImageStyle, { borderColor: colors.secondary }]} source={require('@/assets/images/logo-prestau.jpg')} />
        </View>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        width: "200%",
        height: 160,
        borderRadius: 15,
        borderWidth: 4,
        position: "absolute",
        top: -10,
        marginLeft: "auto",
        marginRight: "auto",
    }
});

const baseImageStyle = {
    width: 80,
    height: 80,
    borderRadius: 5,
    borderWidth: 2,
    alignSelf: "center" as const, // Type assertion to satisfy the type requirement
    marginTop: 55,
}