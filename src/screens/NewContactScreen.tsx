import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RootStack } from "../../App";
import { useNavigation } from "@react-navigation/native";
import { useLayoutEffect, useState } from "react";
import { AntDesign, Feather, Ionicons } from "@expo/vector-icons";
import { FloatingLabelInput } from "react-native-floating-label-input";
import CountryPicker, {
  Country,
  CountryCode,
} from "react-native-country-picker-modal";
import {
  validateCountryCode,
  validateFirstName,
  validateLastName,
  validatePhoneNo,
} from "../util/Validation";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";
import { useSendNewContact } from "../socket/UseSendNewContact";

type NewContactScreenProp = NativeStackNavigationProp< RootStack,"NewContactScreen">;

export default function NewContactScreen() {
  const navigation = useNavigation<NewContactScreenProp>();
  const themeColor = "#c688a0";

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const [countryCode, setCountryCode] = useState<CountryCode>("LK");
  const [country, setCountry] = useState<Country | null>(null);
  const [show, setShow] = useState<boolean>(false);
  const [callingCode, setCallingCode] = useState("+94");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNo, setPhoneNo] = useState("");

  const newContact = useSendNewContact();
  const sendNewContact = newContact.sendNewContact;

  const sendData = () => {
    sendNewContact({
      id: 0,
      firstName,
      lastName,
      countryCode: callingCode,
      contactNo: phoneNo,
      createdAt: "",
      updatedAt: "",
      status: "",
    });
    setFirstName("");
    setLastName("");
    setCallingCode("+94");
    setPhoneNo("");
  };

  const inputStyle = {
    containerStyles: {
      borderBottomWidth: 1.8,
      borderColor: themeColor,
      paddingBottom: 6,
    },
    customLabelStyles: {
      colorFocused: themeColor,
      fontSizeFocused: 13,
    },
    inputStyles: {
      color: "#000",
      fontSize: 17,
      paddingVertical: 6,
    },
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Scrollable Form */}
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 22,
          paddingBottom: 120,
          paddingTop: 30,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="flex-row items-center mb-6">
          <TouchableOpacity
            className="mr-4"
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back-sharp" size={28} color="black" />
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-gray-800">New Contact</Text>
        </View>

        {/* First Name */}
        <View className="flex-row items-center gap-x-3 mb-7 h-14">
          <Feather name="user" size={24} color={themeColor} />
          <View className="flex-1">
            <FloatingLabelInput
              label="First Name"
              value={firstName}
              onChangeText={setFirstName}
              {...inputStyle}
            />
          </View>
        </View>

        {/* Last Name */}
        <View className="flex-row items-center gap-x-3 mb-7 h-14">
          <Feather name="user" size={24} color={themeColor} />
          <View className="flex-1">
            <FloatingLabelInput
              label="Last Name"
              value={lastName}
              onChangeText={setLastName}
              {...inputStyle}
            />
          </View>
        </View>

        {/* Country Picker */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setShow(true)}
          className="flex-row items-center h-14 px-3 rounded-xl mb-7"
          style={{
            borderWidth: 1.8,
            borderColor: themeColor,
            backgroundColor: "#fafafa",
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
            size={18}
            color="black"
            style={{ marginLeft: 8, marginTop: 3 }}
          />
        </TouchableOpacity>

        {/* Phone */}
        <View className="flex-row items-center gap-x-3 mb-12 h-14">
          <Feather name="phone" size={24} color={themeColor} />
          <View style={{ width: 95 }}>
            <FloatingLabelInput
              label=""
              editable={false}
              value={country ? `+${country.callingCode}` : callingCode}
              onChangeText={setCallingCode}
              {...inputStyle}
            />
          </View>
          <View className="flex-1">
            <FloatingLabelInput
              label="Phone"
              inputMode="tel"
              value={phoneNo}
              onChangeText={setPhoneNo}
              {...inputStyle}
            />
          </View>
        </View>
      </ScrollView>

      {/* Save Button - Lowered & Larger */}
      <View
        style={{
          position: "absolute",
          bottom: 30,
          left: 20,
          right: 20,
        }}
      >
        <Pressable
          className="h-16 items-center justify-center rounded-full"
          style={{
            backgroundColor: themeColor,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 5 },
            shadowOpacity: 0.25,
            shadowRadius: 7,
            elevation: 6,
          }}
          onPress={() => {
            const firstNameValid = validateFirstName(firstName);
            const lastNameValid = validateLastName(lastName);
            const countryCodeValid = validateCountryCode(callingCode);
            const phoneNoValid = validatePhoneNo(phoneNo);

            if (
              firstNameValid ||
              lastNameValid ||
              countryCodeValid ||
              phoneNoValid
            ) {
              Toast.show({
                type: ALERT_TYPE.WARNING,
                title: "Warning",
                textBody: "Please fill all fields correctly",
              });
            } else {
              sendData();
            }
          }}
        >
          <Text className="font-bold text-lg text-white">Add</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
