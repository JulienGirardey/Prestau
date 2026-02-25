import React from 'react';
import { View, StyleSheet, Button } from 'react-native';
import { useThemeColors } from '@/hooks/useThemeColors';

type Props = {
    title?: string,
    onPress?: () => void,
    style?: any
}

export function NewButton({ title = "Button", onPress, style }: Props) {
    const colors = useThemeColors();
    return (
        <View style={[styles.buttonContainer, style]}>
            <Button title={title} onPress={onPress} color={colors.background} />
        </View>
    );
}

const styles = StyleSheet.create({
    buttonContainer: {
        width: 328,
        height: 43,
        backgroundColor: '#EE4832',
        borderRadius: 15,
        justifyContent: 'center',
		
    },
    buttonStyle: {
        color: '#F5F2D9',
    }
});