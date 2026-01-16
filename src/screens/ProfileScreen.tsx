import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Dimensions,
} from "react-native";
import { RootStack } from "../../App";
import { useNavigation } from "@react-navigation/native";
import { useContext, useLayoutEffect, useState } from "react";
import { useTheme } from "../theme/ThemeProvider";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useUserProfile } from "../socket/UseUserProfile";
import { uploadProfileImage } from "../api/UserService";
import { AuthContext } from "../components/AuthProvider";
import { useUserRegistration } from "../components/UserContext";

type ProfileScreenProp = NativeStackNavigationProp<RootStack, "ProfileScreen">;

const { height } = Dimensions.get("window");

export default function ProfileScreen() {
  const navigation = useNavigation<ProfileScreenProp>();
  const { applied } = useTheme();
  const userProfile = useUserProfile();
  const { userData } = useUserRegistration();
  const auth = useContext(AuthContext);

  const [image, setImage] = useState<string | null>(null);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "My Profile",
      headerShown: false,
    });
  }, [navigation]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets?.length) {
      const uri = result.assets[0].uri;
      setImage(uri);
      await uploadProfileImage(String(auth?.userId ?? 0), uri);
    }
  };

  const profileImageSource = image
    ? { uri: image }
    : userProfile?.profileImage
      ? { uri: userProfile.profileImage }
      : require("../../assets/images/defaultAvatar.png");

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View
          style={{
            backgroundColor: "#c688a0",
            height: height * 0.25,
            borderBottomLeftRadius: 30,
            borderBottomRightRadius: 30,
          }}
          className="justify-center items-center relative"
        >
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="absolute top-5 left-4 p-2 bg-white rounded-full shadow-md"
          >
            <Feather name="arrow-left" size={20} color="#c688a0" />
          </TouchableOpacity>
          <Text className="text-white text-2xl font-bold mt-6">My Profile</Text>
        </View>

        {/* Profile Image */}
        <View className="items-center -mt-14">
          <View className="relative">
            <Image
              source={profileImageSource}
              className="w-36 h-36 rounded-full border-4 border-white shadow-lg bg-gray-200"
            />
            <TouchableOpacity
              onPress={pickImage}
              className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow-md"
            >
              <Feather name="edit-2" size={18} color="#c688a0" />
            </TouchableOpacity>
          </View>
          <Text className="text-xl font-bold text-gray-800 mt-3">
            {userProfile?.firstName} {userProfile?.lastName}
          </Text>
        </View>

        {/* Profile Info */}
        <View className="px-5 mt-10 space-y-5">
          {/* Bio */}
          <View className="bg-white p-4 rounded-2xl shadow-sm mb-3">
            <View className="flex-row items-center mb-2">
              <Feather name="info" size={20} color="#c688a0" />
              <Text className="text-lg font-semibold ml-2 text-gray-800">
                Bio
              </Text>
            </View>
            {userData?.bio ? (
              <Text className="text-gray-700 text-base leading-5">
                {userData.bio}
              </Text>
            ) : (
              <Text className="text-gray-400 italic">No bio added yet.</Text>
            )}
          </View>

          {/* Full Name */}
          <View className="bg-white p-4 rounded-2xl shadow-sm mb-3">
            <View className="flex-row items-center mb-2">
              <Feather name="user" size={20} color="#c688a0" />
              <Text className="text-lg font-semibold ml-2 text-gray-800">
                Full Name
              </Text>
            </View>
            <Text className="text-gray-700 text-base">
              {userProfile?.firstName} {userProfile?.lastName}
            </Text>
          </View>

          {/* Phone */}
          <View className="bg-white p-4 rounded-2xl shadow-sm mb-8">
            <View className="flex-row items-center mb-2">
              <Feather name="phone" size={20} color="#c688a0" />
              <Text className="text-lg font-semibold ml-2 text-gray-800">
                Phone
              </Text>
            </View>
            <Text className="text-gray-700 text-base">
              {userProfile?.countryCode} {userProfile?.contactNo}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
