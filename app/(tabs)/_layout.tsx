import { HapticTab } from "@/components/HapticTab";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { AntDesign, EvilIcons, MaterialIcons } from "@expo/vector-icons";
import { Tabs, useNavigation, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  BackHandler,
  Modal,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context"; // ✅ أضف هذا
import tw from "twrnc";

export default function TabLayout() {
  const { t } = useTranslation();
  const router = useRouter();
  const navigation = useNavigation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const backAction = () => {
      if (navigation.canGoBack()) {
        router.push("../");
      } else {
        setVisible(true);
      }
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    return () => backHandler.remove();
  }, [navigation]);

  return (
    <SafeAreaProvider>
      {/* ✅ Modal خارج الـ Tabs */}
      <Modal transparent visible={visible} animationType="fade">
        <View style={tw`flex-1 justify-center items-center bg-black/50`}>
          <View style={tw`w-4/5 bg-white rounded-xl p-5 items-center`}>
            <Text style={tw`text-lg font-bold mb-2.5`}>{t("alert")}</Text>
            <Text style={tw`text-base text-center mb-5`}>
              {t("do_you_want_to_exit_the_application")}
            </Text>
            <View style={tw`flex-row justify-between`}>
              <TouchableOpacity
                style={tw`flex-1 p-2.5 rounded bg-blue-500 items-center mx-1.5`}
                onPress={() => setVisible(false)}
              >
                <Text style={tw`text-white text-base`}>{t("cancel")}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={tw`flex-1 p-2.5 rounded bg-red-500 items-center mx-1.5`}
                onPress={() => {
                  setVisible(false);
                  BackHandler.exitApp();
                }}
              >
                <Text style={tw`text-white text-base`}>{t("confirm")}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ✅ Tabs يجب أن يحتوي فقط على Tabs.Screen */}
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors.light.tint,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarBackground: TabBarBackground,
          tabBarStyle: Platform.select({
            ios: { position: "absolute" },
            default: {},
          }),
        }}
      >
        <Tabs.Screen
          name="profile"
          options={{
            title: t("profile"),
            tabBarIcon: ({ color }) => (
              <AntDesign name="user" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="index"
          options={{
            title: t("resturants"),
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="restaurant-menu" size={24} color={color} />
            ),
          }}
        />
        {/* <Tabs.Screen
          name="market"
          options={{
            title: t("market"),
            tabBarIcon: ({ color }) => (
              <Entypo name="shop" size={24} color={color} />
            ),
          }}
        /> */}
        <Tabs.Screen
          name="search"
          options={{
            title: t("Search"),
            tabBarIcon: ({ color }) => (
              <EvilIcons name="search" size={24} color={color} />
            ),
          }}
        />
      </Tabs>
    </SafeAreaProvider>
  );
}
