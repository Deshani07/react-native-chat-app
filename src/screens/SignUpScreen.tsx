import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StatusBar,
  Text,
  View,
  ScrollView,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import "../../global.css";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";
import { useTheme } from "../theme/ThemeProvider";
import { FloatingLabelInput } from "react-native-floating-label-input";
import { useState } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStack } from "../../App";
import { useNavigation } from "@react-navigation/native";
import { useUserRegistration } from "../components/UserContext";
import { validateFirstName, validateLastName } from "../util/Validation";

type SignUpProps = NativeStackNavigationProp<RootStack, "SignUpScreen">;

const { width, height } = Dimensions.get("window");

export default function SignUpScreen() {
  const navigation = useNavigation<SignUpProps>();
  const { applied } = useTheme();
  const logo =
    applied === "light"
      ? require("../../assets/logo/logoColor.png")
      : require("../../assets/logo/logo.png");
  const { userData, setUserData } = useUserRegistration();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1 bg-slate-50"
    >
      <StatusBar barStyle="light-content" backgroundColor="#c688a0" />

      {/* HEADER */}
      <View
        style={{
          backgroundColor: "#c688a0",
          borderBottomLeftRadius: 30,
          borderBottomRightRadius: 30,
          paddingVertical: height * 0.06,
          paddingHorizontal: width * 0.05,
          alignItems: "center",
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
          style={{
            color: "#fff",
            fontWeight: "bold",
            fontSize: width * 0.045,
            textAlign: "center",
            paddingHorizontal: 10,
            lineHeight: 22,
          }}
        >
          “Join now and make every chat count — your journey starts here!”
        </Text>
      </View>

      {/* FORM */}
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: width * 0.06,
          paddingVertical: height * 0.04,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <SafeAreaView className="w-full">
          <View className="w-full mb-6">
            <FloatingLabelInput
              label="First Name"
              value={userData.firstName}
              onChangeText={(text) =>
                setUserData((prev) => ({ ...prev, firstName: text }))
              }
              containerStyles={{
                backgroundColor: "#fff",
                borderRadius: 14,
                paddingHorizontal: 14,
                height: 55,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
              }}
              customLabelStyles={{
                colorFocused: "#c688a0",
                colorBlurred: "#6B7280",
              }}
            />
          </View>

          <View className="w-full mb-6">
            <FloatingLabelInput
              label="Last Name"
              value={userData.lastName}
              onChangeText={(text) =>
                setUserData((prev) => ({ ...prev, lastName: text }))
              }
              containerStyles={{
                backgroundColor: "#fff",
                borderRadius: 14,
                paddingHorizontal: 14,
                height: 55,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
              }}
              customLabelStyles={{
                colorFocused: "#c688a0",
                colorBlurred: "#6B7280",
              }}
            />
          </View>
        </SafeAreaView>
      </ScrollView>

      {/* FIXED FOOTER BUTTON */}
      <View
        style={{
          width: "100%",
          paddingHorizontal: width * 0.05,
          paddingBottom: Platform.OS === "ios" ? height * 0.03 : 16,
          position: "absolute",
          bottom: 0,
          backgroundColor: "#f8fafc",
        }}
      >
        <Pressable
          style={{
            backgroundColor: "#c688a0",
            height: 55,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 9999,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.2,
            shadowRadius: 5,
            elevation: 6,
          }}
          onPress={() => {
            const validFirstName = validateFirstName(userData.firstName);
            const validLastName = validateLastName(userData.lastName);

            if (validFirstName) {
              Toast.show({
                type: ALERT_TYPE.WARNING,
                title: "Warning",
                textBody: validFirstName,
              });
            } else if (validLastName) {
              Toast.show({
                type: ALERT_TYPE.WARNING,
                title: "Warning",
                textBody: validLastName,
              });
            } else {
              navigation.navigate("ContactScreen");
            }
          }}
        >
          <Text
            style={{
              color: "#fff",
              fontWeight: "bold",
              fontSize: width * 0.045,
            }}
          >
            Next
          </Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
