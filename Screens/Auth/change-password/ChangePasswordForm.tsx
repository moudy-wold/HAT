import { ForgetPass } from "@/api/auth";
import Loader from "@/components/Global/Loader/Loader";
import OTPPopup from "@/components/Global/OTPPopup/OTPPopup";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  Keyboard,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import tw from "twrnc";

function ChangePasswordForm() {
  const { t, i18n } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [openVerifyPopup, setOpenVerifyPopup] = useState(false);
  const [contactValue, setContactValue] = useState("");
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onFinish = async ({ contact }: any) => {
    setIsLoading(true);
    setContactValue(contact);
    ForgetPass(contact)
      .then((res) => {
        if (res.status) {
          setIsLoading(false);
          Toast.show({
            type: "success",
            text1: t("code_has_been_sent_to_your_email_or_phone"),
          });
          setOpenVerifyPopup(true);
        }
      })
      .catch((err) => {
        console.error(err);
        Toast.show({
          type: "error",
          text1: err?.response?.data?.message,
        });
        setIsLoading(false);
      });
  };

  return (
    <View
      style={[tw`p-5 `, { direction: i18n.language == "ar" ? "rtl" : "ltr" }]}
    >
      <Loader isVisible={isLoading} isLoading={isLoading} />
      <View style={tw`flex flex-col  gap-8`}>
        <Controller
          name="contact"
          control={control}
          defaultValue=""
          rules={{ required: t("please_enter_email_or_phone") }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={tw`h-[52px] bg-[#eee] px-5 rounded-full ${
                errors.contact ? "border-red-700" : "border-gray-400"
              }`}
              placeholder={t("please_enter_your_email_or_phone")}
              returnKeyType="done"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              onSubmitEditing={() => Keyboard.dismiss()}
            />
          )}
        />

        <TouchableOpacity
          onPress={handleSubmit(onFinish)}
          style={tw`bg-[#fc6011]  py-2 px-4 rounded-full  `}
        >
          <Text style={tw`text-white text-center text-lg`}>{t("send")}</Text>
        </TouchableOpacity>
      </View>

      <View style={tw`flex-row items-center my-2 mx-auto`}>
        <Text style={tw`text-gray-500 text-sm`}>{t("want_to_log_in")} </Text>
        <TouchableOpacity onPress={() => router.push("/(Auth)/login")}>
          <Text style={tw`text-[#fc6011] underline`}>{t("login")}</Text>
        </TouchableOpacity>
      </View>

      <Modal animationType="slide" transparent={true} visible={openVerifyPopup}>
        <View style={tw`flex-1 justify-center items-center bg-black/50`}>
          <View style={tw`w-80 p-3 bg-white rounded-lg shadow-lg`}>
            <OTPPopup
              setOpenVerifyPopup={setOpenVerifyPopup}
              emailValue={contactValue}
            />
            <TouchableOpacity
              style={tw`mt-4 bg-red-600 rounded py-2 items-center justify-center`}
              onPress={() => {
                setOpenVerifyPopup(false);
              }}
            >
              <Text style={tw`text-white`}>{t("close")}</Text>
            </TouchableOpacity>
          </View>
          <Toast />
        </View>
      </Modal>
    </View>
  );
}

export default ChangePasswordForm;
