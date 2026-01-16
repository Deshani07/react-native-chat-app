import { Text, TouchableOpacity, View, StatusBar, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemeOption, useTheme } from "../theme/ThemeProvider";
import { useNavigation } from "@react-navigation/native";
import { useLayoutEffect, useContext } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStack } from "../../App";
import { AuthContext } from "../components/AuthProvider";
import { Ionicons } from "@expo/vector-icons";

const options: ThemeOption[] = ["light", "dark", "system"];
type SettingScreenProp = NativeStackNavigationProp<RootStack, "SettingScreen">;

export default function SettingScreen() {
  const { preference, applied, setPreference } = useTheme();
  const navigation = useNavigation<SettingScreenProp>();
  const auth = useContext(AuthContext);
  const themeColor = "#c688a0"; // App theme color

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Settings",
      headerStyle: {
        backgroundColor: applied === "dark" ? "#0f172a" : "#f8fafc",
      },
      headerTintColor: applied === "dark" ? "#ffffff" : "#0f172a",
    });
  }, [navigation, applied]);

  return (
    <SafeAreaView
      className="flex-1 bg-slate-50 dark:bg-slate-900 p-5"
      edges={["right", "bottom", "left"]}
    >
      <StatusBar hidden={false} />

      {/* Appearance Section */}
      <Text className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mb-4">
        Appearance
      </Text>
      <View className="flex-row gap-x-3 flex-wrap">
        {options.map((option) => {
          const isActive = preference === option;

          const iconName =
            option === "light"
              ? "sunny"
              : option === "dark"
                ? "moon"
                : "phone-portrait";

          return (
            <TouchableOpacity
              key={option}
              className={`flex-row items-center px-5 py-3 rounded-xl mb-3 shadow ${
                isActive
                  ? "bg-[${themeColor}] shadow-lg"
                  : "bg-white dark:bg-slate-800 shadow-sm"
              }`}
              onPress={() => setPreference(option)}
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: isActive ? 0.3 : 0.1,
                shadowRadius: 4,
                elevation: isActive ? 5 : 2,
              }}
            >
              <Ionicons
                name={iconName}
                size={22}
                color={
                  isActive ? "#fff" : applied === "dark" ? "#e2e8f0" : "#1e293b"
                }
              />
              <Text
                className={`ml-3 font-semibold ${
                  isActive
                    ? "text-white"
                    : applied === "dark"
                      ? "text-gray-200"
                      : "text-gray-800"
                }`}
              >
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Account Section */}
      <Text className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mt-6 mb-4">
        Account
      </Text>

   
      <TouchableOpacity
        className="flex-row items-center justify-between bg-white dark:bg-slate-800 p-4 rounded-xl mb-3 shadow-sm"
        onPress={() => navigation.navigate("ProfileScreen")}
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
          elevation: 2,
        }}
      >
        <View className="flex-row items-center">
          <Ionicons name="person-circle-outline" size={24} color="#4b5563" />
          <Text className="ml-3 text-lg font-semibold text-gray-800 dark:text-gray-200">
            My Profile
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
      </TouchableOpacity>

    
      <TouchableOpacity
        className="flex-row items-center bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm"
        onPress={() => {
          Alert.alert(
            "Confirm Logout",
            "Are you sure you want to log out?",
            [
              {
                text: "Cancel",
                onPress: () => console.log("Logout cancelled"),
                style: "cancel",
              },
              {
                text: "Logout",
                onPress: () => auth?.signOut(),
                style: "destructive",
              },
            ],
            { cancelable: true }
          );
        }}
      >
        <Ionicons name="log-out-outline" size={24} color="#ef4444" />
        <Text className="ml-3 text-lg font-semibold text-red-500">Log Out</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
