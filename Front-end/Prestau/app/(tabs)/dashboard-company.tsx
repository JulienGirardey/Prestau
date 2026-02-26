import { StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Header } from "@/components/Header";
import { DefaultCard } from "@/components/DefaultCard";

export default function DashboardCompany() {
    const colors = useThemeColors();
    const { width, height } = useWindowDimensions();
    return (
        <View style={{ flex: 1 }}>
            <Header />
            <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
                <DefaultCard style={{ width: Math.min(width * 0.8, 400), height: Math.min(height * 0.25, 135), justifyContent: "flex-start" }}>
                    <Text style={styles.title}>Dashboard Company</Text>
                </DefaultCard>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        padding: 100
    },
    title: {
        fontSize: 31,
        textAlign: "center",
    },
    body: {
        flex: 1,
        justifyContent: "space-between"
    },
    form: {
        width: "100%"
    },
    spacer: {
        flex: 1
    },
    buttonCreateAccount: {
        marginTop: 30
    }
});
