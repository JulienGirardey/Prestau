import { Stack } from "expo-router";
import { Keyboard, TouchableWithoutFeedback, View } from "react-native";

export default function RootLayout() {
  return (
    // Dismiss the keyboard when tapping outside of it
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{ flex: 1 }}>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        />
      </View>
    </TouchableWithoutFeedback>
  );
}
