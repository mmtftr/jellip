import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";

import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";
import { Button } from "tamagui";
import { Delete } from "@tamagui/lucide-icons";
import { resetAndReseed } from "../../components/SeedProvider";

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
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
          headerRight: () =>
            // check if development
            __DEV__ && (
              <Button
                marginEnd="$2"
                icon={Delete}
                variant="outlined"
                color="red"
                theme="red_active"
                size="$2"
                onPress={resetAndReseed}
              >
                Reseed
              </Button>
            ),
        }}
      />
    </Tabs>
  );
}
