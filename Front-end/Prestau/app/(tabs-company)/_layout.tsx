import { Tabs } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { useThemeColors } from "@/hooks/useThemeColors";

// Layout principal pour les tabs de la company, définissant les écrans accessibles et leur apparence dans la barre de navigation
export default function CompanyTabLayout() {
    const Colors = useThemeColors();
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: Colors.background,
                    borderTopWidth: 4,
                    borderTopColor: Colors.secondary,
                    paddingBottom: 5,
                    height: 70
                },
                tabBarActiveTintColor: Colors.secondary,
                tabBarInactiveTintColor: Colors.inactive,
            }}
        >
            <Tabs.Screen
                name="dashboard-company"
                options={{
                    tabBarLabel: "Dashboard",
                    tabBarIcon: ({ color, size }) => (
                        <FontAwesome name="dashboard" color={color} size={size} />
                    ),
                }}
            />
            <Tabs.Screen
                name="create-job"
                options={{
                    tabBarLabel: "Create Job",
                    tabBarIcon: ({ color, size }) => (
                        <FontAwesome name="plus" color={color} size={size} />
                    ),
                }}
            />
            <Tabs.Screen
                name="ProfileCompany"
                options={{
                    tabBarLabel: "Profile",
                    tabBarIcon: ({ color, size }) => (
                        <FontAwesome name="user" color={color} size={size} />
                    ),
                }}
            />
        </Tabs>
    );
}
