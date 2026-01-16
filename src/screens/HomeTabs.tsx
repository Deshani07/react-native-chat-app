import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ChatsScreen from "./ChatsScreen";
import StatusScreen from "./StatusScreen";
import CallsScreen from "./CallsScreen";
import SettingScreen from "./SettingScreen";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "react-native";

const Tabs = createBottomTabNavigator();

export default function HomeTabs() {
  const themeColor = "#c688a0"; 

  return (
    <Tabs.Navigator
      screenOptions={({ route }) => ({
        
        tabBarIcon: ({ focused }) => {
          let iconName: any;
          if (route.name === "Chats") iconName = "chatbubble-ellipses";
          else if (route.name === "Story") iconName = "time";
          else if (route.name === "Calls") iconName = "call";
          else if (route.name === "Settings") iconName = "settings";

          return (
            <Ionicons
              name={iconName}
              size={26}
              color={focused ? themeColor : "#9ca3af"}
            />
          );
        },
        tabBarLabel: ({ focused }) => (
          <Text
            style={{
              fontSize: 12,
              fontWeight: "600",
              color: focused ? themeColor : "#9ca3af",
              marginBottom: 2,
            }}
          >
            {route.name}
          </Text>
        ),
        tabBarStyle: {
          backgroundColor: "#fff",
          height: 70,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          borderTopWidth: 0,
          elevation: 10,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: 0.1,
          shadowRadius: 5,
        },
      })}
    >
      <Tabs.Screen name="Chats" component={ChatsScreen}options={{headerShown:false}}/>
      <Tabs.Screen name="Story" component={StatusScreen} />
      <Tabs.Screen name="Calls" component={CallsScreen} />
      <Tabs.Screen name="Settings" component={SettingScreen} />
    </Tabs.Navigator>
  );
}
