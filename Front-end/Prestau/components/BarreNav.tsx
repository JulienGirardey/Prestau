import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useThemeColors } from '@/hooks/useThemeColors'; //

export function BarreNavigation() {
    const colors = useThemeColors(); //

    return (
        <View style={[styles.navContainer, { borderColor: colors.secondary }]}>
            <TouchableOpacity style={[styles.navItem, { borderRightWidth: 1, borderColor: colors.secondary }]}>
                <Text style={[styles.navText, { color: colors.primary }]}>Dash</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.navItem, { borderRightWidth: 1, borderColor: colors.secondary }]}>
                <Text style={[styles.navText, { color: colors.primary }]}>PM</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.navItem, { borderRightWidth: 1, borderColor: colors.secondary }]}>
                <Text style={[styles.navText, { color: colors.primary }]}>Message</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.navItem}>
                <Text style={[styles.navText, { color: colors.primary }]}>Profile</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    navContainer: {
		width: 328,
		height: 60,
        flexDirection: "row",
        backgroundColor: '#F5F2D9',
        borderRadius: 25,
        borderWidth: 2,
        overflow: 'hidden',
        marginHorizontal: 20,
        marginBottom: 20,
    },
    navItem: {
		flex: 1,
        paddingVertical: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    navText: {
        fontSize: 16,
        fontWeight: 'bold',
    }
});