import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";

import { useColorScheme } from "@/components/useColorScheme";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";
import { Button, Heading, useTheme, XStack } from "tamagui";
import { Delete } from "@tamagui/lucide-icons";
import { resetAndReseed } from "../../components/SeedProvider";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Pressable } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { fastSpring } from "@/constants/tamagui";

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  const { top } = useSafeAreaInsets();
  const t = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: t.blue10.get(),
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
        tabBarShowLabel: false,
        tabBarButton({ ...props }) {
          const pressedIn = useSharedValue(false);

          const animatedScale = useAnimatedStyle(() => {
            return {
              transform: [
                { scale: withSpring(pressedIn.value ? 0.85 : 1, fastSpring) },
              ],
            };
          });

          return (
            <Animated.View
              style={[{ flex: 1, flexDirection: "row" }, animatedScale]}
            >
              <Pressable
                onPressIn={() => (pressedIn.value = true)}
                onPressOut={() => (pressedIn.value = false)}
                {...props}
              />
            </Animated.View>
          );
        },
        header(props) {
          return (
            <XStack
              paddingTop={top}
              justifyContent="center"
              pb="$2"
              backgroundColor="$accentBackground"
            >
              <Heading size="$5">Jellip</Heading>
              {/* {props.options.headerRight?.({})} */}
            </XStack>
          );
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="question"
        options={{
          title: "Question",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="question-circle" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => <TabBarIcon name="gear" color={color} />,
        }}
      />
    </Tabs>
  );
}
