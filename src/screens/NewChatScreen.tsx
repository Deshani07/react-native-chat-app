import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useLayoutEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { RootStack } from "../../App";
import { useNavigation } from "@react-navigation/native";
import {
  FlatList,
  Image,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import { User } from "../socket/chat";
import { useUserList } from "../socket/UseUserList";

type NewChatScreenProp = NativeStackNavigationProp<RootStack, "NewChatScreen">;

export default function NewChatScreen() {
  const navigation = useNavigation<NewChatScreenProp>();
  const [search, setSearch] = useState("");
  const users = useUserList();
  const themeColor = "#c688a0";

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const renderItem = ({ item }: { item: User }) => (
    <TouchableOpacity
      className="flex-row items-center bg-white mx-3 my-1 rounded-xl p-3"
      style={{
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 1 },
        shadowRadius: 2,
        elevation: 1,
      }}
      onPress={() => {
        navigation.replace("SingleChatScreen", {
          chatId: item.id,
          friendName: `${item.firstName} ${item.lastName}`,
          lastSeenTime: item.updatedAt,
          profileImage: item.profileImage
            ? item.profileImage
            : `https://ui-avatars.com/api/?name=${item.firstName}+${item.lastName}&background=random`,
        });
      }}
    >
      <Image
        source={{
          uri: item.profileImage
            ? item.profileImage
            : `https://ui-avatars.com/api/?name=${item.firstName}+${item.lastName}&background=random`,
        }}
        className="h-12 w-12 rounded-full"
      />
      <View className="flex-1 ml-3">
        <Text className="font-bold text-base">
          {item.firstName} {item.lastName}
        </Text>
        <Text className="text-gray-500 text-sm italic">
          {item.status === "ACTIVE"
            ? "Already in Friend List; Message Now"
            : "Hey there! I am using Mingo"}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const filterdUsers = [...users]
    .filter((user) => {
      return (
        user.firstName.toLowerCase().includes(search.toLowerCase()) ||
        user.lastName.toLowerCase().includes(search.toLowerCase()) ||
        user.contactNo.includes(search)
      );
    })
    .sort((a, b) => a.firstName.localeCompare(b.firstName));

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar hidden={false} translucent={false} backgroundColor={themeColor} />

      {/* Header */}
      <View
        className="flex-row items-center px-4 py-4"
        style={{ backgroundColor: themeColor }}
      >
        <TouchableOpacity
          className="mr-3"
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back-sharp" size={24} color="white" />
        </TouchableOpacity>
        <View>
          <Text className="text-lg font-bold text-white">Contact List</Text>
          <Text className="text-xs text-white opacity-90">
            {users.length} contacts
          </Text>
        </View>
      </View>

      {/* Search */}
      <View className="flex-row items-center bg-white mx-4 mt-3 rounded-full px-3 h-12 border border-gray-200">
        <Ionicons name="search" size={18} color="gray" />
        <TextInput
          className="flex-1 text-base ps-2"
          placeholder="Search contacts"
          value={search}
          onChangeText={(text) => setSearch(text)}
        />
      </View>

      {/* New Contact */}
      <TouchableOpacity
        className="flex-row items-center bg-white mx-3 mt-4 rounded-xl p-3"
        style={{
          shadowColor: "#000",
          shadowOpacity: 0.05,
          shadowOffset: { width: 0, height: 1 },
          shadowRadius: 2,
          elevation: 1,
        }}
        onPress={() => navigation.navigate("NewContactScreen")}
      >
        <View
          className="rounded-full h-12 w-12 items-center justify-center"
          style={{ backgroundColor: themeColor }}
        >
          <Feather name="user-plus" size={22} color="white" />
        </View>
        <Text className="text-base font-bold ml-3"> Add New Contact</Text>
      </TouchableOpacity>

      {/* User List */}
      <FlatList
        data={filterdUsers}
        renderItem={renderItem}
        keyExtractor={(_, index) => index.toString()}
        className="mt-2"
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </SafeAreaView>
  );
}
