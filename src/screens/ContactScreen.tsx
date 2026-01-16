import { AntDesign } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  View,
  Dimensions,
} from "react-native";
import CountryPicker, {
  Country,
  CountryCode,
} from "react-native-country-picker-modal";
import { SafeAreaView } from "react-native-safe-area-context";
import { RootStack } from "../../App";
import { useNavigation } from "@react-navigation/native";
import { useUserRegistration } from "../components/UserContext";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";
import { validateCountryCode, validatePhoneNo } from "../util/Validation";

type ContactProps = NativeStackNavigationProp<RootStack, "ContactScreen">;

const { width, height } = Dimensions.get("window");

export default function ContactScreen() {
  const navigation = useNavigation<ContactProps>();
  const [countryCode, setCountryCode] = useState<CountryCode>("LK");
  const [country, setCountry] = useState<Country | null>(null);
  const [show, setShow] = useState<boolean>(false);
  const { userData, setUserData } = useUserRegistration();
  const [callingCode, setCallingCode] = useState("+94");
  const [phoneNo, setPhoneNo] = useState("");

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <StatusBar barStyle="dark-content" backgroundColor="#c688a0" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={100}
        className="flex-1"
      >
        {/* HEADER */}
        <View className="bg-[#c688a0] rounded-b-3xl py-10 px-5 items-center shadow-md">
          <Image
            source={require("../../assets/logo/logoColor.png")}
            className="h-24 w-24 mb-2"
            resizeMode="contain"
          />
          <Text className="text-white font-bold text-center text-base px-4">
            “Easily find friends using your contacts — always kept private.”
          </Text>
        </View>

        {/* MAIN */}
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "space-between",
            paddingHorizontal: width * 0.05,
            paddingVertical: height * 0.04,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* INPUT CARD */}
          <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 16,
              padding: width * 0.06,
              marginTop: height * 0.04,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 4,
              width: "100%",
              maxWidth: 500,
              alignSelf: "center",
            }}
          >
            {/* COUNTRY PICKER */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                borderBottomWidth: 1,
                borderBottomColor: "#CBD5E1",
                paddingBottom: 10,
              }}
            >
              <CountryPicker
                countryCode={countryCode}
                withFilter
                withFlag
                withCountryNameButton
                withCallingCode
                visible={show}
                onClose={() => setShow(false)}
                onSelect={(c) => {
                  setCountryCode(c.cca2);
                  setCountry(c);
                  setShow(false);
                }}
              />
              <AntDesign
                name="caret-down"
                size={14}
                color="black"
                style={{ marginLeft: 4 }}
              />
            </View>

            {/* PHONE INPUTS */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: height * 0.03,
                gap: 10,
              }}
            >
              <TextInput
                inputMode="tel"
                style={{
                  flexBasis: "25%",
                  height: 50,
                  textAlign: "center",
                  fontSize: width * 0.045,
                  fontWeight: "600",
                  borderBottomWidth: 2,
                  borderBottomColor: "#16A34A",
                }}
                placeholder="+94"
                editable={false}
                value={country ? `+${country.callingCode}` : callingCode}
              />
              <TextInput
                inputMode="tel"
                style={{
                  flex: 1,
                  height: 50,
                  fontSize: width * 0.045,
                  fontWeight: "600",
                  borderBottomWidth: 2,
                  borderBottomColor: "#16A34A",
                }}
                placeholder="77 #### ###"
                value={phoneNo}
                onChangeText={setPhoneNo}
              />
            </View>
          </View>

          {/* FOOTER BUTTONS */}
          <View
            style={{
              marginTop: height * 0.05,
              width: "100%",
              maxWidth: 500,
              alignSelf: "center",
              gap: 14,
            }}
          >
            {/* Continue */}
            <Pressable
              style={{
                backgroundColor: "#c688a0",
                paddingVertical: height * 0.02,
                borderRadius: 9999,
                alignItems: "center",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 3 },
                shadowOpacity: 0.2,
                shadowRadius: 5,
                elevation: 5,
              }}
              onPress={() => {
                const validCountryCode = validateCountryCode(callingCode);
                const validPhone = validatePhoneNo(phoneNo);

                if (validCountryCode) {
                  Toast.show({
                    type: ALERT_TYPE.WARNING,
                    title: "Warning",
                    textBody: validCountryCode,
                  });
                } else if (validPhone) {
                  Toast.show({
                    type: ALERT_TYPE.WARNING,
                    title: "Warning",
                    textBody: validPhone,
                  });
                } else {
                  setUserData((previous) => ({
                    ...previous,
                    countryCode: country
                      ? `+${country.callingCode}`
                      : callingCode,
                    contactNo: phoneNo,
                  }));
                  navigation.replace("BioScreen");
                }
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  fontSize: width * 0.045,
                  fontWeight: "bold",
                }}  >
                Continue
              </Text>
            </Pressable>

            {/* Back */}
            <Pressable
              style={{
                backgroundColor: "#E5E7EB",
                paddingVertical: height * 0.02,
                borderRadius: 9999,
                alignItems: "center",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 3,
                elevation: 2,
              }}
              onPress={() => navigation.navigate("SignUpScreen")}
            >
              <Text
                style={{
                  color: "#374151",
                  fontSize: width * 0.045,
                  fontWeight: "600",
                }} >
                Back
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
