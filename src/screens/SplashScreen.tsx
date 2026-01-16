import { useEffect } from "react";
import { StatusBar, Text, View, Image } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import "../../global.css";
import CircleShape from "../components/CircleShape";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStack } from "../../App";
import { useTheme } from "../theme/ThemeProvider";
import { useWebSocketPing } from "../socket/UseWebSocketPing";

type Props = NativeStackNavigationProp<RootStack, "SplashScreen">;

export default function SplashScreen() {
  const navigation = useNavigation<Props>();

  // Animation values
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.8);
  const circle1 = useSharedValue(0);
  const circle2 = useSharedValue(0);
  const circle3 = useSharedValue(0);
  const circle4 = useSharedValue(0);

  useWebSocketPing(60000);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 3000 });
    scale.value = withTiming(1, { duration: 3000 });

    circle1.value = withTiming(15, { duration: 4000 });
    circle2.value = withTiming(-15, { duration: 4000 });
    circle3.value = withTiming(20, { duration: 5000 });
    circle4.value = withTiming(-20, { duration: 4500 });

    // Optional navigation
    // const timer = setTimeout(() => {
    //   navigation.replace("SignUpScreen");
    // }, 3500);
    // return () => clearTimeout(timer);
  }, [navigation]);

  // Logo animation style
  const logoStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  // Floating background shapes
  const circle1Style = useAnimatedStyle(() => ({
    transform: [{ translateY: circle1.value }],
  }));
  const circle2Style = useAnimatedStyle(() => ({
    transform: [{ translateY: circle2.value }],
  }));
  const circle3Style = useAnimatedStyle(() => ({
    transform: [{ translateY: circle3.value }],
  }));
  const circle4Style = useAnimatedStyle(() => ({
    transform: [{ translateY: circle4.value }],
  }));

  const { applied } = useTheme();
  const logo =
    applied === "light"
      ? require("../../assets/logo/logoColor.png")
      : require("../../assets/logo/logo.png");

  return (
    <SafeAreaView className="flex-1" edges={["top"]}>
      <StatusBar hidden={true} />

      {/* Solid Background */}
      <View
        className="flex-1 justify-center items-center"
        style={{ backgroundColor: "#c688a0" }}
      >
        {/* Floating Background Circles */}
        <Animated.View
          style={[
            circle1Style,
            { position: "absolute", top: -60, left: -40, zIndex: 0 },
          ]}
        >
          <CircleShape
            width={200}
            height={200}
            borderRadius={999}
            className="bg-[#d19caf] opacity-70"
          />
        </Animated.View>

        <Animated.View
          style={[
            circle2Style,
            { position: "absolute", top: -30, right: -50, zIndex: 0 },
          ]}
        >
          <CircleShape
            width={150}
            height={150}
            borderRadius={999}
            className="bg-[#b2728b] opacity-70"
          />
        </Animated.View>

        <Animated.View
          style={[
            circle3Style,
            { position: "absolute", bottom: -50, left: 60, zIndex: 0 },
          ]}
        >
          <CircleShape
            width={180}
            height={180}
            borderRadius={999}
            className="bg-[#d19caf] opacity-60"
          />
        </Animated.View>

        <Animated.View
          style={[
            circle4Style,
            { position: "absolute", bottom: -30, right: 40, zIndex: 0 },
          ]}
        >
          <CircleShape
            width={120}
            height={120}
            borderRadius={999}
            className="bg-[#b2728b] opacity-60"
          />
        </Animated.View>

        {/* Logo with Fade & Scale */}
        <Animated.Image
          source={logo}
          style={[{ height: 200, width: 220, zIndex: 1 }, logoStyle]}
          resizeMode="contain"
        />

        {/* Loading Text */}
        <Animated.View style={[logoStyle, { zIndex: 1 }]} className="mt-5">
          <View className="flex-row">
            <Text className="text-white text-base tracking-widest">Loading</Text>
            <Text className="text-white text-base tracking-widest animate-pulse">
              ...
            </Text>
          </View>
        </Animated.View>

        {/* Version & Owner Info */}
        <Animated.View className="absolute bottom-8" style={logoStyle}>
          <View className="items-center">
            <Text className="text-[10px] font-semibold tracking-wider text-slate-300 uppercase">
              Powered by: {process.env.EXPO_PUBLIC_APP_OWNER}
            </Text>
            <Text className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
              v{process.env.EXPO_PUBLIC_APP_VERSION}
            </Text>
          </View>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}
