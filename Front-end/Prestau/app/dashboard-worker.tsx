import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Header } from "@/components/Header";
import { DefaultCard } from "@/components/DefaultCard";
import { NewButton } from "@/components/Button";
import { BarreNavigation } from "@/components/BarreNav";

export default function DashboardWorker() {
  const colors = useThemeColors();
  const handlePress = () => {
    console.log("Button clique");
  };
  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <Header title="Dashboard Worker" />
      <Text style={styles.title}>Dashboard Worker</Text>
      <DefaultCard title="Mission a venir">
        <Text>Mission a venir</Text>
      </DefaultCard>
      <DefaultCard title="Me disponibilites">
        <Text>Me disponibilités</Text>
      </DefaultCard>
      <DefaultCard title="Dernières missions postées">
        <Text>Dernières missions postées</Text>
      </DefaultCard>
      <View style={styles.buttonContainer}>
        <NewButton title="Avis Professionels" onPress={handlePress} />
      </View>
	  <BarreNavigation />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
	gap: 20,
    alignItems: "center",
    padding: 100,
  },
  title: {
    paddingTop: 30,
    fontSize: 31,
    textAlign: "center",
  },
  body: {
    flex: 1,
    justifyContent: "space-between",
  },
  form: {
    width: "100%",
  },
  spacer: {
    flex: 1,
  },
  buttonCreateAccount: {
    marginTop: 30,
  }
});
