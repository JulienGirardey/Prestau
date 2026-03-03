import { Stack } from "expo-router";
import { Keyboard, View } from "react-native";

export default function RootLayout() {
  return (
    <View style={{ flex: 1 }} onStartShouldSetResponder={() => {
      Keyboard.dismiss();
      return false;  // ← false = ne capture PAS le geste, laisse passer le scroll
    }}>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="login" />
        <Stack.Screen name="(tabs-company)/dashboard-company" />
        <Stack.Screen name="(tabs-company)/create-mission" />
        <Stack.Screen name="(tabs-company)/profile-company" />
        <Stack.Screen name="(tabs-worker)/dashboard-worker" />
        <Stack.Screen name="(tabs-worker)/profile-worker" />
      </Stack>
    </View>
  );
}
