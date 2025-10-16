import { LogOut } from "@/api/auth";
import Loader from "@/components/Global/Loader/Loader";
import TitleAndBackButton from "@/components/Global/TitleAndBackButton/TitleAndBackButton";
import useStore from "@/store/useStore";
import { AntDesign, Entypo, Ionicons, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FlatList,
  Modal,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import tw from "twrnc";
export default function ProfileContent() {
  const { t, i18n } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { set_wishList_length, set_cart_length } = useStore();
  const [openLogOut, setOpenLogOut] = useState(false);
  const items = useMemo(
    () => [
      {
        id: "1",
        title: t("profile_info"),
        icon: <AntDesign name="user" size={24} color="gray" />,
        url: "/(Pages)/profile",
      },
      {
        id: "2",
        title: t("wishlist"),
        icon: <MaterialIcons name="payment" size={24} color="gray" />,
        url: "/(Pages)/wishlist",
      },
      {
        id: "3",
        title: t("my_address"),
        icon: <Entypo name="address" size={24} color="gray" />,
        url: "/(Pages)/myaddress",
      },
      {
        id: "4",
        title: t("my_orders"),
        icon: <Ionicons name="bag" size={24} color="gray" />,
        url: "/(Pages)/my_orders",
      },
      {
        id: "5",
        title: t("support"),
        icon: <MaterialIcons name="support-agent" size={24} color="gray" />,
        url: "/(Pages)/support",
      },
      {
        id: "7",
        title: t("languages"),
        icon: <MaterialIcons name="language" size={24} color="gray" />,
        url: "/(Pages)/languages",
      },
      {
        id: "8",
        title: t("logout"),
        icon: <AntDesign name="logout" size={24} color="gray" />,
        url: "",
      },
    ],
    [t]
  ); // هنا مهم وضع t في dependencies

  const handleLogOut = async () => {
    setIsLoading(true);
    try {
      await LogOut();

      Toast.show({
        type: "success",
        text1: t("logout_success"),
      });
      // set_wishList_length(0);
      set_cart_length(0);
      await AsyncStorage.removeItem("user_name");
      await AsyncStorage.removeItem("phoneNumber");
      await AsyncStorage.removeItem("wishlist");
      await AsyncStorage.removeItem("isLogend");
      await AsyncStorage.removeItem("cart_length");
      await AsyncStorage.removeItem("access_token");

      router.replace("/(Auth)/login");
    } catch (err: any) {
      Toast.show({
        type: "error",
        text1: err?.response?.data?.message || t("logout_failed"),
      });
    } finally {
      setIsLoading(false);
    }
  };
  const Item = ({ item }: any) => {
    return (
      <TouchableOpacity
        onPress={() => {
          item.url ? router.push(item?.url) : setOpenLogOut(true);
        }}
        style={tw`overflow-visible ${
          i18n.language === "ar"
            ? "rounded-tr-2xl rounded-br-2xl"
            : "rounded-tr-2xl rounded-br-2xl"
        }  bg-[#eeeeee] p-3 py-2 flex flex-row items-center gap-5 my-2  `}
      >
        <View style={tw`p-3 bg-[#ddd] rounded-full`}>{item?.icon}</View>
        <Text style={tw``}>{item?.title} </Text>
        <View
          style={tw`  absolute top-1/2 ${
            i18n.language === "ar"
              ? "-left-[18px] rounded-tr-2xl rounded-br-2xl "
              : "-right-[18px] rounded-tr-2xl rounded-br-2xl "
          }    bg-[#eeeeee] p-[1px]`}
        >
          <MaterialIcons
            name="keyboard-arrow-right"
            size={18}
            color="#3e3e3e"
            style={{
              transform: [
                { rotate: i18n.language === "ar" ? "180deg" : "0deg" },
              ],
            }}
          />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={[
        tw` bg-white h-full`,
        {
          direction: i18n.language === "ar" ? "rtl" : "ltr",
        },
      ]}
    >
      {/* Start Title && Back Button */}
      <View style={tw`px-4 pt-2`}>
        <TitleAndBackButton title={t("profile")} />
      </View>
      {/* End Title && Back Button */}
      <Loader isVisible={isLoading} isLoading={isLoading} />

      <FlatList
        style={[tw`overflow-visible`, { paddingStart: 20, paddingEnd: 30 }]}
        data={items}
        renderItem={({ item }) => <Item item={item} />}
        keyExtractor={(item) => item.id}
      />
      <Modal transparent animationType="fade" visible={openLogOut}>
        <TouchableWithoutFeedback onPress={() => setOpenLogOut(false)}>
          <View style={tw`flex-1 justify-center items-center bg-black/50`}>
            <View style={tw`w-4/5 bg-white rounded-lg p-3 items-center`}>
              <Text style={tw`mb-4 text-black text-base font-bold`}>
                {t("do_you_want_log_out")}
              </Text>

              <View style={tw`flex-row justify-between mt-4`}>
                <TouchableOpacity
                  style={tw`bg-red-500 rounded-lg py-2 px-5 mx-2`}
                  onPress={() => handleLogOut()}
                >
                  <Text style={tw`text-white`}>{t("confirm")}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={tw`bg-gray-400 rounded-lg py-2 px-5 mx-2`}
                  onPress={() => setOpenLogOut(false)}
                >
                  <Text style={tw`text-white`}>{t("cancel")}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}
