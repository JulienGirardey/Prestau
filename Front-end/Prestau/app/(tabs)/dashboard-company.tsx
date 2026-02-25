import { StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Header } from "@/components/Header";
import { DefaultCard } from "@/components/DefaultCard";

export default function DashboardCompany() {
    const colors = useThemeColors();
    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <Header title="Dashboard Company" style={styles.headerstyle} />
            <DefaultCard />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        padding: 100
    },
    title: {
        paddingTop: 30,
        fontSize: 31,
        textAlign: "center"
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
