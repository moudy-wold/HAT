import { ResendOTP, ResetPass } from "@/api/auth";
import { Ionicons } from "@expo/vector-icons";
import { usePathname, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { OtpInput } from "react-native-otp-entry";
import Toast from "react-native-toast-message";
import tw from "twrnc";
import Loader from "../Loader/Loader";

const OTPPopup = (props: any) => {
  const { t, i18n } = useTranslation();
  const path = usePathname();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [otp, setOtp] = useState<string>("");
  const [resendDisabled, setResendDisabled] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(60);
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [errors, setErrors] = useState<any>({});
  const re_password_ref = useRef<any>(null);
  const handleResendOTP = async () => {
    setIsLoading(true);
    setResendDisabled(true);

    try {
      const res = await ResendOTP();
      if (res.status) {
        Toast.show({
          type: "success",
          text1: t("code_has_been_resent"),
        });
      }
    } catch (err: any) {
      console.error(err);
      Toast.show({
        type: "error",
        text1: err?.response?.data?.message || "Something went wrong",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors: any = {};

    if (props.emailValue) {
      if (!password || password.length < 6) {
        newErrors.password = t("please_enter_new_password");
      }
      if (!confirmPassword) {
        newErrors.confirmPassword = t("please_confirm_your_password");
      } else if (password !== confirmPassword) {
        newErrors.confirmPassword = t("password_does_not_match");
      }
    }

    if (!otp || otp.length !== 6) {
      newErrors.otp = t("enter_6_bar_verification_code");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onFinish = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const res = await ResetPass(props.emailValue, otp, password);

      Toast.show({
        type: "success",
        text1: t("code_has_been_sent_to_your_email"),
      });
      setTimeout(() => {
        props.setOpenVerifyPopup(false);
        router.push("/(Auth)/login");
      }, 1000);
    } catch (err: any) {
      console.error(err);
      Toast.show({
        type: "error",
        text1: err?.response?.data?.message || t("unexpected_error"),
      });
    } finally {
      setIsLoading(false);
    }
    // } else { // console.log("else"); // ConfirmOTP(otp) // .then((res) => { // if (path.includes("regisrer")) { // router.push("/(Auth)/login"); // } // Toast.show({ // type: "success", // text1: t("account_verified_successfully"), // }); // props.setOpenVerifyPopup(false); // }) // .catch((err: any) => { // console.error(err); // Toast.show({ // type: "error", // text1: err?.response?.data?.message, // }); // }) // .finally(() => { // setIsLoading(false); // }); // }q
  };

  useEffect(() => {
    let timer: any;
    if (resendDisabled) {
      timer = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000); // كل ثانية
    }
    return () => clearInterval(timer);
  }, [resendDisabled]);

  useEffect(() => {
    if (countdown === 0) {
      setResendDisabled(false);
      setCountdown(60);
    }
  }, [countdown]);
  return (
    <View
      style={[
        tw`mt-5 bg-white rounded-lg`,
        { direction: i18n.language == "ar" ? "rtl" : "ltr" },
      ]}
    >
      <Loader isVisible={isLoading} isLoading={isLoading} />

      <View>
        <Text style={tw`text-[#00171F] mt-2 mb-1`}>
          {t("enter_6_bar_verification_code")}
        </Text>

        <View>
          <OtpInput
            numberOfDigits={6}
            type="alphanumeric"
            focusColor="green"
            focusStickBlinkingDuration={500}
            onTextChange={setOtp}
            textInputProps={{
              accessibilityLabel: "One-Time Password",
            }}
            theme={{
              containerStyle: tw`mb-4`,
              pinCodeContainerStyle: tw`w-12 h-12 border-2 ${
                errors.otp ? "border-red-500" : "border-gray-300"
              } rounded-xl mx-[1px]`,
              pinCodeTextStyle: tw`text-lg font-bold text-gray-800`,
              focusStickStyle: tw`bg-orange-500`,
              focusedPinCodeContainerStyle: tw`border-orange-500`,
            }}
          />
          {errors.otp && (
            <Text style={tw`text-red-500 text-sm mb-2`}>{errors.otp}</Text>
          )}
        </View>

        <View style={tw` flex flex-row items-center gap-1 my-5`}>
          <Text style={tw`text-[#00171F]`}>{t("didnt_you_receive_code")}</Text>
          <Text
            style={tw`${
              resendDisabled ? "text-gray-400" : "text-[#fc6011] underline"
            }`}
            onPress={handleResendOTP}
          >
            {resendDisabled
              ? `${t("resend_in")} ${countdown} ${t("secound")}`
              : t("rebroadcast")}
          </Text>
        </View>

        {props.emailValue && (
          <View>
            {/* حقل كلمة المرور الجديدة */}
            <View style={tw`mt-3`}>
              <View style={tw`relative`}>
                <TextInput
                  style={tw`h-[52px] bg-[#eee] px-5 pr-12 rounded-full border-2 ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder={t("new_password")}
                  secureTextEntry={!showPassword}
                  returnKeyType="next"
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    if (errors.password) {
                      setErrors((prev: any) => ({ ...prev, password: null }));
                    }
                  }}
                  onSubmitEditing={() => re_password_ref.current?.focus()}
                />
                <TouchableOpacity
                  style={tw`absolute right-4 top-4`}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons
                    name={showPassword ? "eye-off" : "eye"}
                    size={20}
                    color="#666"
                  />
                </TouchableOpacity>
              </View>
              {errors.password && (
                <Text style={tw`text-red-500 text-sm mt-1`}>
                  {errors.password}
                </Text>
              )}
            </View>

            {/* حقل تأكيد كلمة المرور */}
            <View style={tw`mt-3`}>
              <View style={tw`relative`}>
                <TextInput
                  style={tw`h-[52px] bg-[#eee] px-5 pr-12 rounded-full border-2 ${
                    errors.confirmPassword
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder={t("confirm_password")}
                  secureTextEntry={!showConfirmPassword}
                  value={confirmPassword}
                  onChangeText={(text) => {
                    setConfirmPassword(text);
                    if (errors.confirmPassword) {
                      setErrors((prev: any) => ({
                        ...prev,
                        confirmPassword: null,
                      }));
                    }
                  }}
                  ref={re_password_ref}
                />
                <TouchableOpacity
                  style={tw`absolute right-4 top-4`}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <Ionicons
                    name={showConfirmPassword ? "eye-off" : "eye"}
                    size={20}
                    color="#666"
                  />
                </TouchableOpacity>
              </View>
              {errors.confirmPassword && (
                <Text style={tw`text-red-500 text-sm mt-1`}>
                  {errors.confirmPassword}
                </Text>
              )}
            </View>
          </View>
        )}

        <TouchableOpacity
          style={tw`rounded-full bg-[#fc6011] flex-row items-center justify-center p-2 my-2 mt-5`}
          onPress={onFinish}
        >
          <Text style={tw`text-white text-lg`}>{t("confirm")}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default OTPPopup;
