import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  KeyboardAvoidingView,
  Text,
  View,
  Platform,
  Image,
  Dimensions,
  TextInput,
  TouchableOpacity,
  Pressable,
  ScrollView,
} from "react-native";
import { RootStack } from "../../App";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../theme/ThemeProvider";
import { useUserRegistration } from "../components/UserContext";
import { useState } from "react";

type BioProps = NativeStackNavigationProp<RootStack, "BioScreen">;

const { height, width } = Dimensions.get("window");

export default function BioScreen() {
  const navigation = useNavigation<BioProps>();
  const { applied } = useTheme();
  const logo =
    applied === "light"
      ? require("../../assets/logo/logoColor.png")
      : require("../../assets/logo/logo.png");
  const { userData, setUserData } = useUserRegistration();

  const [bio, setBio] = useState(userData.bio || "");

  const handleContinue = () => {
    setUserData({ ...userData, bio });
    navigation.replace("AvatarScreen");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1 bg-slate-50"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: height * 0.2 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* HEADER */}
        <View
          className="items-center rounded-b-[30px] shadow-md"
          style={{
            backgroundColor: "#c688a0",
            paddingVertical: height * 0.06,
            paddingHorizontal: width * 0.05,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 6,
            elevation: 6,
          }}
        >
          <Image
            source={logo}
            style={{
              height: height * 0.12,
              width: height * 0.12,
              marginBottom: 10,
              resizeMode: "contain",
            }}
          />
          <Text
            className="text-white font-bold text-center px-2"
            style={{ fontSize: width * 0.045, lineHeight: 22 }}
          >
            “ Tell us about yourself..! ”
          </Text>
        </View>

        {/* BIO FORM */}
        <View className="px-5 mt-8 flex-1">
          <Text className="text-base font-bold mb-2">Add Bio (optional)</Text>

          <TextInput
            placeholder="Enter your bio..."
            multiline
            numberOfLines={5}
            className="border border-gray-300 rounded-xl bg-white p-7 text-base"
            textAlignVertical="top"
            value={bio}
            onChangeText={setBio}
          />

          {/* Skip Button */}
          <TouchableOpacity
            onPress={() => navigation.replace("AvatarScreen")}
            className="mt-5 bg-gray-400 py-3 rounded-xl items-center w-60"  >
            <Text className="text-white font-bold text-base">Skip</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* FOOTER: Continue + Back */}
      <View
        className="px-5 pb-4 bg-slate-50 absolute bottom-0 w-full"
        style={{ paddingBottom: Platform.OS === "ios" ? 30 : 16 }}
      >
        <Pressable
          className="bg-pink-400 py-4 rounded-full items-center shadow-md mb-4"
          style={{ backgroundColor: "#c688a0" }}
          onPress={handleContinue}
        >
          <Text
            style={{
              color: "#fff",
              fontSize: width * 0.045,
              fontWeight: "bold",
            }}
          >
            {" "}
            Continue{" "}
          </Text>
        </Pressable>

        <Pressable
          className="bg-gray-200 py-4 rounded-full items-center shadow-sm"
          onPress={() => navigation.navigate("ContactScreen")}
        >
          <Text
            style={{
              color: "#374151",
              fontSize: width * 0.045,
              fontWeight: "600",
            }}
          >
            Back
          </Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
