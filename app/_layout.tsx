import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
  useRoute,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

import { useColorScheme } from "react-native";
import MigrationProvider from "../components/MigrationProvider";
import { TamaguiProvider, Theme, YStack } from "tamagui";
import {
  Toast,
  ToastProvider,
  ToastViewport,
  useToastState,
} from "@tamagui/toast";
import { tamaguiConfig } from "@/constants/tamagui";
import { useRehydrate } from "@colorfy-software/zfy";
import { stores } from "@/services/store";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)/question",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    Inter: require("@tamagui/font-inter/otf/Inter-Medium.otf"),
    InterBold: require("@tamagui/font-inter/otf/Inter-Bold.otf"),
    ...FontAwesome.font,
  });

  const rehydrated = true;
  // useRehydrate(stores);

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded || !rehydrated) {
    return null;
  }

  return <RootLayoutNav />;
}
const CurrentToast = () => {
  const currentToast = useToastState();

  if (!currentToast || currentToast.isHandledNatively) return null;
  return (
    <Toast
      key={currentToast.id}
      duration={currentToast.duration}
      enterStyle={{ opacity: 0, scale: 0.5, y: -25 }}
      exitStyle={{ opacity: 0, scale: 1, y: -20 }}
      y={0}
      opacity={1}
      scale={1}
      animation="fast"
      width="100%"
      viewportName={currentToast.viewportName}
    >
      <YStack w="100%" p="$4">
        <Toast.Title>{currentToast.title}</Toast.Title>
        {!!currentToast.message && (
          <Toast.Description>{currentToast.message}</Toast.Description>
        )}
      </YStack>
    </Toast>
  );
};

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { top } = useSafeAreaInsets();

  return (
    <TamaguiProvider
      config={tamaguiConfig}
      defaultTheme={colorScheme || "light"}
    >
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <ToastProvider burntOptions={{ from: "top" }}>
          <ToastViewport position="absolute" left={0} right={0} top={top} />
          <CurrentToast />
          <MigrationProvider>
            <Stack>
              <Stack.Screen
                name="(tabs)"
                options={{ headerShown: false, title: "Home" }}
              />
              <Stack.Screen
                name="grammar/[id]"
                options={{ title: "Grammar" }}
              />
              <Stack.Screen name="review" options={{ presentation: "modal" }} />
            </Stack>
          </MigrationProvider>
        </ToastProvider>
      </ThemeProvider>
    </TamaguiProvider>
  );
}
