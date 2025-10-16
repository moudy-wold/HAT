import AxiosInterceptor from "@/api/AxiosInterceptor";
import i18n from "@/i18n/index";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { I18nextProvider } from "react-i18next";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context"; // ✅ أضف هذا
import Toast from "react-native-toast-message";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });
  const [langReady, setLangReady] = useState(false);

  useEffect(() => {
    const prepare = async () => {
      try {
        const savedLang = await AsyncStorage.getItem("appLanguage");
        if (savedLang) {
          await i18n.changeLanguage(savedLang);
        }
      } catch (e) {
        console.log("Error loading language:", e);
      } finally {
        setLangReady(true);
        if (loaded) {
          SplashScreen.hideAsync();
        }
      }
    };

    if (loaded) {
      prepare();
    }
  }, [loaded]);

  if (!loaded || !langReady) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <I18nextProvider i18n={i18n}>
          <AxiosInterceptor />
          <Stack
            initialRouteName="index"
            screenOptions={{
              headerStyle: { backgroundColor: "#f4511e" },
              headerTintColor: "#fff",
              headerTitleStyle: { fontWeight: "bold" },
              contentStyle: { backgroundColor: "#FFFFFF" },
              headerShown: false,
            }}
          >
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
          <Toast position="top" />
        </I18nextProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
