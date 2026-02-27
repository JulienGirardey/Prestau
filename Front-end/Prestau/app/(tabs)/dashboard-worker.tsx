import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Header } from "@/components/Header";
import { DefaultCard } from "@/components/DefaultCard";
import { NewButton } from "@/components/Button";

export default function DashboardWorker() {
    const colors = useThemeColors();
    return (
        <View style={{ flex: 1 }}>
            <Header />
            <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
                <ScrollView style={styles.body} contentContainerStyle={{ alignItems: "center", gap: 20,  }}>
                        <Text style={styles.title}>Dashboard Worker</Text>
					<DefaultCard title="Missions à venir">
						<Text style={styles.titleCard}>Missions à venir</Text>
						<DefaultCard title="Mission 1">
							<Text style={styles.titleCard}>Mission 1</Text>
						</DefaultCard>
					</DefaultCard>
					<DefaultCard title="Mes disponibilités">
						<Text style={styles.titleCard}>Mes disponibilités</Text>
					</DefaultCard>
					<DefaultCard title="Dernières missions postées">
						<Text style={styles.titleCard}>Dernières missions postées</Text>
					</DefaultCard>
					<View style={styles.buttonCreateAccount}>
						<NewButton title="Avis Professionnels" onPress={() => console.log("Button clique")} />
					</View>
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
        fontSize: 31,
        textAlign: "center"
    },
    body: {
        flex: 1
    },
    form: {
        width: "100%"
    },
	buttonCreateAccount: {
		marginTop: 20,
		paddingBottom: 20,
		width: "100%"
	},
	titleCard: {
	fontSize: 25,
	textAlign: "center",
	color: "#F5F2D9",
	marginTop: -20
	}
});
