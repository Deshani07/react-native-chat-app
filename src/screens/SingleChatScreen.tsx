import {
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RootStack } from "../../App";
import { useLayoutEffect, useState } from "react";
import { Ionicons, MaterialIcons, Feather } from "@expo/vector-icons";
import { useSingleChat } from "../socket/UseSingleChat";
import { Chat } from "../socket/chat";
import { formatChatTime } from "../util/DateFormatter";
import { useSendChat } from "../socket/UseSendChat";

type SingleChatScreenProps = NativeStackScreenProps<
  RootStack,
  "SingleChatScreen"
>;

export default function SingleChatScreen({ route, navigation }: SingleChatScreenProps) {
  const { chatId, friendName, profileImage } = route.params;
  const singleChat = useSingleChat(chatId);
  const messages = singleChat.messages;
  const friend = singleChat.friend;
  const sendMessage = useSendChat();
  const [input, setInput] = useState("");
  const themeColor = "#c688a0";

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const renderItem = ({ item }: { item: Chat }) => {
    const isMe = item.from.id !== chatId;

    return (
      <View
        style={{
          alignSelf: isMe ? "flex-end" : "flex-start",
          backgroundColor: isMe ? themeColor : "#f3f4f6",
          borderRadius: 20,
          borderTopRightRadius: isMe ? 6 : 20,
          borderTopLeftRadius: isMe ? 20 : 6,
          paddingVertical: 10,
          paddingHorizontal: 14,
          marginVertical: 6,
          maxWidth: "75%",
          shadowColor: "#000",
          shadowOpacity: 0.06,
          shadowOffset: { width: 0, height: 2 },
          shadowRadius: 4,
          elevation: 2,
        }}
      >
        <Text
          style={{
            color: isMe ? "white" : "#1f2937",
            fontSize: 16,
            lineHeight: 22,
          }}
        >
          {item.message}
        </Text>
        <View style={{ flexDirection: "row", justifyContent: "flex-end", marginTop: 4 }}>
          <Text
            style={{
              fontSize: 11,
              color: isMe ? "#f0f0f0" : "#6b7280",
              marginRight: 4,
              fontStyle: "italic",
            }}
          >
            {formatChatTime(item.createdAt)}
          </Text>
          {isMe && (
            <Ionicons
              name={
                item.status === "READ"
                  ? "checkmark-done-sharp"
                  : item.status === "DELIVERED"
                  ? "checkmark-done-sharp"
                  : "checkmark"
              }
              size={16}
              color={item.status === "READ" ? "#e0e0e0" : "#d1d5db"}
            />
          )}
        </View>
      </View>
    );
  };

  const handleSendChat = () => {
    if (!input.trim()) return;
    sendMessage(chatId, input);
    setInput("");
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <StatusBar hidden={false} translucent={false} backgroundColor={themeColor} />

      {/* Header */}
      <View
        className="flex-row items-center px-4 py-4"
        style={{
          backgroundColor: themeColor,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.2,
          shadowRadius: 4,
          elevation: 4,
        }}
      >
        <TouchableOpacity className="mr-3" onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-sharp" size={28} color="white" />
        </TouchableOpacity>

        <Image
          source={{ uri: profileImage }}
          className="h-12 w-12 rounded-full mr-3 border-2 border-white"
        />

        <View className="flex-1">
          <Text className="text-lg font-bold text-white">
            {friend ? `${friend.firstName} ${friend.lastName}` : friendName}
          </Text>
          <Text className="text-xs text-white opacity-90 italic">
            {friend?.status === "ONLINE"
              ? "Online"
              : `Last seen ${formatChatTime(friend?.updatedAt ?? "")}`}
          </Text>
        </View>

        <TouchableOpacity className="mr-3">
          <Ionicons name="call-sharp" size={22} color="white" />
        </TouchableOpacity>
        <TouchableOpacity className="mr-3">
          <Ionicons name="videocam" size={22} color="white" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="ellipsis-vertical" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Chat Area */}
      <KeyboardAvoidingView
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === "android" ? 0 : 60}
        behavior={Platform.OS === "android" ? "padding" : "height"} 
      >
        <FlatList
          data={messages}
          renderItem={renderItem}
          keyExtractor={(_, index) => index.toString()}
          className="px-4 flex-1"
          inverted
          contentContainerStyle={{ paddingBottom: 16 }}
        />

        {/* Input Bar */}
        <View
          className="flex-row items-end px-3 py-3 bg-white"
          style={{
            borderTopWidth: 1,
            borderTopColor: "#e5e7eb",
            shadowColor: "#000",
            shadowOpacity: 0.05,
            shadowOffset: { width: 0, height: -2 },
            shadowRadius: 4,
            elevation: 2,
          }}
        >
          <TouchableOpacity className="mr-2 justify-center">
            <Ionicons name="happy-outline" size={24} color="#9ca3af" />
          </TouchableOpacity>
          <TouchableOpacity className="mr-2 justify-center">
            <Feather name="paperclip" size={22} color="#9ca3af" />
          </TouchableOpacity>

          <TextInput
            value={input}
            onChangeText={setInput}
            multiline
            placeholder="Type a message"
            className="flex-1 min-h-12 max-h-32 px-4 py-2 bg-gray-300 rounded-3xl text-base"
            placeholderTextColor="#9ca3af"
          />

          {input.trim() === "" ? (
            <TouchableOpacity className="ml-2 rounded-full h-12 w-12 items-center justify-center bg-gray-300">
              <MaterialIcons name="keyboard-voice" size={22} color="white" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              className="ml-2 rounded-full h-12 w-12 items-center justify-center"
              style={{ backgroundColor: themeColor, shadowColor: "#000", shadowOpacity: 0.1, shadowOffset: { width: 0, height: 2 }, shadowRadius: 4, elevation: 2 }}
              onPress={handleSendChat}
            >
              <Ionicons name="send" size={22} color="white" />
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
