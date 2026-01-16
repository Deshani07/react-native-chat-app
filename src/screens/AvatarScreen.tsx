import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { useContext, useState } from "react";
import { useUserRegistration } from "../components/UserContext";
import { validateProfileImage } from "../util/Validation";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";
import { createNewAccount } from "../api/UserService";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStack } from "../../App";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../components/AuthProvider";

type AvatarScreenProps = NativeStackNavigationProp<RootStack, "AvatarScreen">;

export default function AvatarScreen() {
  const navigation = useNavigation<AvatarScreenProps>();
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const { userData, setUserData } = useUserRegistration();
  const auth = useContext(AuthContext);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImage(uri);
      setUserData((prev) => ({ ...prev, profileImage: uri }));
    }
  };

  const avatars = [
    require("../../assets/avatar/avatar_1.png"),
    require("../../assets/avatar/avatar_2.png"),
    require("../../assets/avatar/avatar_3.png"),
    require("../../assets/avatar/avatar_4.png"),
    require("../../assets/avatar/avatar_5.png"),
    require("../../assets/avatar/avatar_6.png"),
  ];

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar hidden={false} />

      {/* HEADER */}
      <View className="bg-[#c688a0] rounded-b-3xl py-10 px-5 items-center shadow-md">
        <Image
          source={require("../../assets/logo/logoColor.png")}
          className="h-20 w-28 mb-3"
          resizeMode="contain"  />
       
      </View>

      {/* MAIN CONTENT */}
      <View className="flex-1 px-5 mt-6 items-center">
        <Text className="text-2xl font-bold text-slate-800 mb-2">
          Choose Your Profile Picture
        </Text>
        <Text className="text-center text-slate-500 mb-6 px-4">
          Pick an image from your gallery or select one of our avatars.
        </Text>

        {/* IMAGE PICKER */}
        <Pressable
          className="h-[130px] w-[130px] rounded-full bg-gray-100 justify-center items-center border-2 border-dashed border-gray-400 mb-6"
          onPress={pickImage}
        >
          {image ? (
            <Image
              source={{ uri: image }}
              className="h-[130px] w-[130px] rounded-full"
            />
          ) : (
            <View className="items-center">
              <Text className="font-bold text-3xl text-slate-400">+</Text>
              <Text className="text-slate-500 font-semibold text-sm">
                Add Image
              </Text>
            </View>
          )}
        </Pressable>

        {/* AVATAR LIST */}
        <FlatList
          data={avatars}
          horizontal
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => {
            const uri = Image.resolveAssetSource(item).uri;
            const isSelected = image === uri;
            return (
              <TouchableOpacity
                className={`mx-2 rounded-full border-3 ${
                  isSelected ? "border-[#c688a0]" : "border-transparent"
                }`}
                onPress={() => {
                  setImage(uri);
                  setUserData((prev) => ({ ...prev, profileImage: uri }));
                }}
              >
                <Image
                  source={item}
                  className="h-20 w-20 rounded-full"
                />
              </TouchableOpacity>
            );
          }}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 10 }}
        />

        {/* BUTTONS */}
        <View className="mt-auto w-full mb-4">
          <Pressable
            disabled={loading}
            className="h-14 bg-[#c688a0] items-center justify-center rounded-full mb-3"
            onPress={async () => {
              const valid = validateProfileImage(
                userData.profileImage
                  ? { uri: userData.profileImage, type: "", fileSize: 0 }
                  : null
              );
              if (valid) {
                Toast.show({
                  type: ALERT_TYPE.WARNING,
                  title: "Warning",
                  textBody: "Please select a profile image or avatar",
                });
                return;
              }

              try {
                setLoading(true);
                const response = await createNewAccount(userData);
                if (response.status) {
                  if (auth) await auth.signUp(String(response.userId));
                } else {
                  Toast.show({
                    type: ALERT_TYPE.WARNING,
                    title: "Warning",
                    textBody: response.message,
                  });
                }
              } catch (e) {
                console.log(e);
              } finally {
                setLoading(false);
              }
            }}
          >
            {loading ? (
              <ActivityIndicator size="large" color="#fff" />
            ) : (
              <Text className="font-bold text-lg text-white">
                Create Account
              </Text>
            )}
          </Pressable>

          <Pressable
            className="h-14 bg-gray-300 items-center justify-center rounded-full"
            
            onPress={() => navigation.navigate("BioScreen")}
          >
            <Text className="font-bold text-lg text-slate-700">Back</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
