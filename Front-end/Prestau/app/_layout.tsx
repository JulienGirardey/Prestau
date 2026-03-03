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
      />
    </View>
  );
}
