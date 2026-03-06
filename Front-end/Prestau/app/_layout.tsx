import { Stack } from "expo-router";
import { Keyboard, View } from "react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
    <View style={{ flex: 1 }} onStartShouldSetResponder={() => {
      Keyboard.dismiss();
      return false;  // ← false = ne capture PAS le geste, laisse passer le scroll
    }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
        <Stack.Screen name="companyCreation" />
        <Stack.Screen name="workerCreation" />
        <Stack.Screen name="(tabs-company)" />
        <Stack.Screen name="(tabs-worker)" />
      </Stack>
    </View>
    </QueryClientProvider>
  );
}
