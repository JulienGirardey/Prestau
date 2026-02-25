import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Header } from "@/components/Header";

export default function DashboardCompany() {
    const colors = useThemeColors();
    return (
        <View style={{ flex: 1 }}>
            <Header />
            <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
                <ScrollView style={styles.body}>
                    <Text style={styles.title}>Dashboard Company</Text>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    title: {
        paddingTop: 30,
        fontSize: 31,
        textAlign: "center"
    },
    body: {
        flex: 1
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
