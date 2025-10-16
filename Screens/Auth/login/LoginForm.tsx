import { Login } from "@/api/auth";
import Loader from "@/components/Global/Loader/Loader";
import useStore from "@/store/useStore";
import { AntDesign } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Keyboard,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import tw from "twrnc";

function LoginForm() {
  const { t, i18n } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const { setIsLogined } = useStore();

  const password_ref = useRef<any>(null);
  const router = useRouter();
  const [obj, setObj] = useState({
    phoneNumber: "",
    password: "",
  });

  const onFinish = async () => {
    if (!obj.phoneNumber) {
      Toast.show({ type: "error", text1: t("please_enter_phoneNumber") });
      return;
    }
    if (!obj.password) {
      Toast.show({ type: "error", text1: t("please_enter_password") });
      return;
    }

    setIsLoading(true);
    try {
      await AsyncStorage.multiRemove([
        "user_name",
        "phoneNumber",
        "wishlist",
        "isLogend",
        "cart_length",
        "access_token",
      ]);

      const res = await Login(obj.phoneNumber, obj.password);

      if (res?.data?.data.user_role === "customer") {
        const token = res?.data?.token || "";
        const user_name = res?.data?.data?.user_name || "";
        const phoneNumber = res?.data?.data?.phoneNumber;
        const wishlistIds =
          res?.data?.Wishlists?.map((obj: any) => obj.id) || [];
        const cartLength = res?.data?.data?.cart?.count.toString() || "0";

        await AsyncStorage.multiSet([
          ["user_name", user_name],
          ["phoneNumber", phoneNumber],
          ["wishlist", JSON.stringify(wishlistIds)],
          ["cart_length", cartLength],
          ["access_token", token],
        ]);

        setIsLogined(true);

        Toast.show({ type: "success", text1: t("login_success") });

        const check_frist_login = await AsyncStorage.getItem("isLogend");
        if (!check_frist_login) {
          AsyncStorage.setItem("isLogend", "true");
          router.push("/(Pages)/guidingScreen");
        } else {
          router.replace("/(tabs)");
        }
      } else {
        Toast.show({
          type: "error",
          text1: t("you_cannot_log_in_with_this_type_of_account"),
        });
      }
    } catch (err: any) {
      console.error("Login Error:", err?.response);
      Toast.show({
        type: "error",
        text1: err?.response?.data?.message || t("login_failed"),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View
      style={[
        tw`px-5 mt-10`,
        { direction: i18n.language === "ar" ? "rtl" : "ltr" },
      ]}
    >
      <Loader isVisible={isLoading} isLoading={isLoading} />
      <View style={tw`flex flex-col gap-6`}>
        {/* Start phoneNumber */}
        <View>
          <TextInput
            style={[
              tw`h-[52px] bg-[#eee] px-5 rounded-full mb-3`,
              i18n.language === "ar" ? tw`text-right` : tw`text-left`,
            ]}
            placeholder={t("phoneNumber")}
            returnKeyType="next"
            value={obj.phoneNumber}
            onChangeText={(e) =>
              setObj((prev) => ({ ...prev, phoneNumber: e }))
            }
            onSubmitEditing={() => password_ref.current.focus()}
          />
        </View>
        {/* End phoneNumber */}

        {/* Start Password */}
        <View style={tw`relative`}>
          <TextInput
            ref={password_ref}
            style={[
              tw`h-[52px] bg-[#eee] px-5 rounded-full`,
              i18n.language === "ar" ? tw`text-right` : tw`text-left`,
            ]}
            placeholder={t("password")}
            returnKeyType="done"
            value={obj.password}
            onChangeText={(e) => setObj((prev) => ({ ...prev, password: e }))}
            onSubmitEditing={() => Keyboard.dismiss()}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity
            style={[
              tw`absolute ${
                i18n.language === "ar" ? "left-4" : "right-4"
              } top-0 h-full justify-center items-center`,
              { width: 40 },
            ]}
            onPress={() => setShowPassword((prev) => !prev)}
            activeOpacity={0.7}
          >
            <AntDesign
              name={showPassword ? "eye-invisible" : "eye"}
              size={22}
              color="#7c7d7e"
            />
          </TouchableOpacity>
        </View>
        {/* End Password */}

        {/* Start Login Button */}
        <TouchableOpacity
          style={tw`bg-[#fc6011] p-3 rounded-full`}
          onPress={onFinish}
        >
          <Text style={tw`text-white text-center  text-base font-semibold `}>
            {t("login")}
          </Text>
        </TouchableOpacity>
        {/* End Login Button */}
      </View>
      {/* Start ForGet Password */}
      <TouchableOpacity
        onPress={() => {
          router.push("/(Auth)/change-password");
        }}
      >
        <Text style={tw`text-[#7c7d7e] text-center my-3 underline`}>
          {t("forgot_password_question")}
        </Text>
      </TouchableOpacity>
      {/* End ForGet Password */}
 
      {/* Start No Account */}
      <View style={tw`flex-row items-center mt-28 mx-auto`}>
        <Text>{t("no_account")} </Text>
        <TouchableOpacity
          onPress={() => {
            router.push("/(Auth)/register");
          }}
        >
          <Text style={tw`text-[#fc6011] underline`}>
            {t("create_account")}{" "}
          </Text>
        </TouchableOpacity>
      </View>
      {/* End No Account */}
    </View>
  );
}

export default LoginForm;
