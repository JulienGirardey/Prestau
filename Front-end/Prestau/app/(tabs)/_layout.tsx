import { Tabs } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: "#c9f4f0",
                    borderTopWidth: 1,
                    borderTopColor: "#c9f4f0",
                    paddingBottom: 5,
                    height: 60
                },
                tabBarActiveTintColor: "#000",
                tabBarInactiveTintColor: "#555",
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    tabBarLabel: "Home",
                    tabBarIcon: ({ color, size }) => (
                        <FontAwesome name="home" color={color} size={size} />
                    ),
                }}
            />
            <Tabs.Screen
                name="dashboard-company"
                options={{
                    tabBarLabel: "Dashboard",
                    tabBarIcon: ({ color, size }) => (
                        <FontAwesome name="dashboard" color={color} size={size} />
                    ),
                }}
            />
        </Tabs>
    );
}