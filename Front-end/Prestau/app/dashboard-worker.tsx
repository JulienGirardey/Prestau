import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Header } from "@/components/Header";

export default function DashboardWorker() {
  const colors = useThemeColors();
  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <Header title="Dashboard Worker" />
      <Text style={styles.title}>Dashboard Worker</Text>
      <MissionBox />
    </SafeAreaView>
  );
}

function MissionBox() {
  const colors = useThemeColors();

  return (
    <View
      style={[
        styles.missionSection,
        {
          backgroundColor: colors.primary,
          borderColor: colors.secondary,
        },
      ]}
    >
      {<Text>Mission a venir</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  },
  missionSection: {
    width: "100%", // Ширина на весь экран
    maxWidth: 350, // Но не шире 350 единиц
    height: 250, // Временная высота для наглядности
    borderRadius: 25, // Сильное закругление углов
    borderWidth: 3, // Толщина красной рамки
    alignItems: "center", // Центрирование элементов внутри по горизонтали
    padding: 20, // Внутренний отступ
  },
});
