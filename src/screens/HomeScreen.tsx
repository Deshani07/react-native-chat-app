import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  FlatList,
  Image,
  Modal,
  Platform,
  Pressable,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { RootStack } from "../../App";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useContext, useLayoutEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useChatList } from "../socket/UseChatList";
import { formatChatTime } from "../util/DateFormatter";
import { Chat } from "../socket/chat";
import { AuthContext } from "../components/AuthProvider";

type HomeScreenProps = NativeStackNavigationProp<RootStack, "HomeScreen">;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenProps>();
  const [search, setSearch] = useState("");
  const chatList = useChatList();
  const [isModalVisible, setModalVisible] = useState(false);
  const auth = useContext(AuthContext);

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <View
          className={`h-28 bg-[#c688a0] rounded-b-3xl flex-row items-center justify-between px-5 shadow-md ${
            Platform.OS === "ios" ? `pt-8` : `pt-4`
          }`}
        >
          <Text className="text-4xl font-extrabold text-white tracking-widest">
            ɱเɳɠσ
          </Text>

          <View className="flex-row space-x-4">
            <TouchableOpacity className="bg-white/20 p-2 rounded-full">
              <Ionicons name="camera" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              className="bg-white/20 p-2 rounded-full"
              onPress={() => setModalVisible(true)}
            >
              <Ionicons name="ellipsis-vertical" size={22} color="white" />
            </TouchableOpacity>
          </View>

       
          <Modal
            animationType="fade"
            visible={isModalVisible}
            transparent={true}
            onRequestClose={() => setModalVisible(false)}
          >
            <Pressable
              className="flex-1 bg-black/30"
              onPress={() => setModalVisible(false)}
            >
              <View className="absolute top-20 right-5 bg-white rounded-lg shadow-lg w-52 p-2">
                <TouchableOpacity
                  className="py-3 border-b border-gray-100"
                  onPress={() => {
                    navigation.navigate("SettingScreen");
                    setModalVisible(false);
                  }}>
                  <Text className="text-lg font-semibold text-gray-700">
                    Settings
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="py-3 border-b border-gray-100"
                  onPress={() => {
                    navigation.navigate("ProfileScreen");
                    setModalVisible(false);
                  }}
                >
                  <Text className="text-lg font-semibold text-gray-700">
                    My Profile
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  className="py-3"
                  onPress={() => {
                    if (auth) auth.signOut();
                  }}>
                  <Text className="text-lg font-semibold text-red-500">
                    Log Out
                  </Text>
                </TouchableOpacity>
              </View>
            </Pressable>
          </Modal>
        </View>
      ),
    });
  }, [navigation, isModalVisible]);

  const filterdChats = [...chatList]
    .filter((chat) => {
      return (
        chat.friendName.toLowerCase().includes(search.toLowerCase()) ||
        chat.lastMessage.toLowerCase().includes(search.toLowerCase())
      );
    })
    .sort(
      (a, b) =>
        new Date(b.lastTimeStamp).getTime() -
        new Date(a.lastTimeStamp).getTime()
    );

  const renderItem = ({ item }: { item: Chat }) => (
    <TouchableOpacity
      className="flex-row items-center py-3 px-4 bg-white my-1 mx-2 rounded-2xl shadow-sm"
      onPress={() => {
        navigation.navigate("SingleChatScreen", {
          chatId: item.friendId,
          friendName: item.friendName,
          lastSeenTime: formatChatTime(item.lastTimeStamp),
          profileImage: item.profileImage
            ? item.profileImage
            : `https://ui-avatars.com/api/?name=${item.friendName.replace(
                " ",
                "+"
              )}&background=random`,
        });
      }}
    >
      <View className="h-14 w-14 rounded-full border border-gray-300 justify-center items-center overflow-hidden">
        <Image
          source={{
            uri: item.profileImage
              ? item.profileImage
              : `https://ui-avatars.com/api/?name=${item.friendName.replace(
                  " ",
                  "+"
                )}&background=random`,
          }}
          className="h-14 w-14"
        />
      </View>

      <View className="flex-1 ms-3">
        <View className="flex-row justify-between items-center">
          <Text
            className="font-bold text-lg text-gray-800 flex-1"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {item.friendName}
          </Text>
          <Text className="text-xs text-gray-400">
            {formatChatTime(item.lastTimeStamp)}
          </Text>
        </View>
        <View className="flex-row justify-between items-center mt-1">
          <Text
            className="text-gray-500 flex-1"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {item.lastMessage}
          </Text>
          {item.unreadCount > 0 && (
            <View className="bg-green-500 rounded-full px-2 py-1 ms-2">
              <Text className="text-white text-xs font-bold">
                {item.unreadCount}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <StatusBar backgroundColor="#c688a0" barStyle="light-content" />

      {/* Search bar */}
      <View className="mx-4 mt-4 mb-2 flex-row items-center bg-white rounded-full px-4 h-12 shadow-sm border border-gray-200">
        <Ionicons name="search" size={20} color="gray" />
        <TextInput
          className="flex-1 text-base ps-2"
          placeholder="Search"
          placeholderTextColor="#888"
          value={search}
          onChangeText={(text) => setSearch(text)}
        />
      </View>

      {/* Chat List */}
      <FlatList
        data={filterdChats}
        renderItem={renderItem}
        keyExtractor={(item) => item.friendId.toString()} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      {/* Floating Button */}
      <TouchableOpacity
        className="absolute bottom-8 right-6 bg-[#c688a0] h-16 w-16 rounded-full shadow-xl justify-center items-center"
        onPress={() => navigation.navigate("NewChatScreen")}
      >
        <Ionicons name="chatbubble-ellipses" size={26} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
