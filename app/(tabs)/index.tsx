import MainPageContent from "@/Screens/MainPageContent/MainPageContent";
import Navbar from "@/components/Global/Navbar/Navbar";
import { useNavigation, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { BackHandler, Modal, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "twrnc";
export default function index() {
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
    <SafeAreaView>
      <View style={tw`bg-white `}>
        <Navbar />
        <MainPageContent />

        {/* Start Close App */}
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
        {/* End Close App */}
      </View>
    </SafeAreaView>
  );
}
