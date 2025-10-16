import { Register } from "@/api/auth";
import Loader from "@/components/Global/Loader/Loader";
import { AntDesign, Ionicons, MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Image,
  Keyboard,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import tw from "twrnc";

function RegisterForm() {
  const { t, i18n } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [avatar, setAvatar] = useState("");
  const [image_type, set_image_type] = useState("");

  // Form data states
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    gender: "male",
  });

  // Validation errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Refs for input navigation
  const email_ref = useRef<any>(null);
  const phone_ref = useRef<any>(null);
  const password_ref = useRef<any>(null);
  const confirme_password_ref = useRef<any>(null);

  // Password visibility states
  const [showPassword, setShowPassword] = useState(false);
  const [show_confirme_Password, set_show_confirme_Password] = useState(false);

  const router = useRouter();

  // Validation function
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!avatar.trim()) {
      newErrors.avatar = t("please_choose_image");
    }
    if (!formData.name.trim()) {
      newErrors.name = t("please_enter_name");
    }
    if (!formData.email.trim()) {
      newErrors.email = t("please_enter_email");
    }
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = t("please_enter_phoneNumber");
    }
    if (!formData.password.trim()) {
      newErrors.password = t("please_enter_password");
    }
    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = t("please_confirm_password");
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t("passwords_do_not_match");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    const submitFormData: any = new FormData();

    submitFormData.append("avatar", {
      uri: avatar,
      type: image_type,
      name: "avatar",
    });
    submitFormData.append("name", formData.name);
    submitFormData.append("email", formData.email);
    submitFormData.append("phoneNumber", formData.phoneNumber);
    submitFormData.append("password", formData.password);
    submitFormData.append("gender", formData.gender);
    submitFormData.append("user_type", "customer");
    try {
      await Register(submitFormData);
      Toast.show({
        type: "success",
        text1: t("registration_has_been_completed_successfully"),
      });
      router.push("/(Auth)/login");
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: t(error.response.data.message),
      });
      console.error("qqqqqqqqq:", error?.response);
    } finally {
      setIsLoading(false);
    }
  };

  const pickImage = async () => {
    const result: any = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
      set_image_type(result.assets[0].mimeType);
      // Clear avatar error when image is selected
      if (errors.avatar) {
        setErrors((prev) => ({ ...prev, avatar: "" }));
      }
    }
  };

  const removeImage = () => {
    setAvatar("");
    set_image_type("");
  };

  // Update form data helper
  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user types
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <View>
      {isLoading && <Loader />}
      <View style={tw`flex flex-col gap-6`}>
        {/* Start Avatar Picker */}
        <View style={tw`items-center`}>
          <TouchableOpacity
            onPress={pickImage}
            style={tw`mb-2 overflow-hidden items-center justify-center`}
          >
            <View
              style={tw`p-1 rounded-full border-[2px] ${
                errors.avatar ? "border-red-700" : "border-gray-300"
              }`}
            >
              <Image
                source={
                  avatar
                    ? { uri: avatar }
                    : require("../../../assets/images/icons8-user-50.png")
                }
                style={tw`${avatar ? "w-24 h-24" : "w-16 h-16"} rounded-full`}
                resizeMode="cover"
              />
            </View>
            {!avatar && (
              <Text
                style={tw`text-gray-400 text-sm mt-2 border-[1px] border-gray-300 rounded-lg px-1`}
              >
                {t("choose_image")}
              </Text>
            )}
          </TouchableOpacity>

          {avatar && (
            <TouchableOpacity
              onPress={removeImage}
              style={tw`flex-row items-center justify-center border-[1px] border-gray-300 rounded-lg p-1`}
            >
                <MaterialIcons name="delete-outline" size={24} color="#FF0000" />{" "}
              <Text style={tw`text-red-500`}>
                {t("remove_image")}
              </Text>
            </TouchableOpacity>
          )}

          {errors.avatar && (
            <Text style={tw`text-red-500 text-sm`}>{errors.avatar}</Text>
          )}
        </View>
        {/* End Avatar Picker */}

        {/* Start  Name */}
        <View>
          <Text style={tw`mb-1 text-gray-700 mx-3`}>{t("name")}</Text>
          <TextInput
            style={tw`h-[52px] bg-[#eee] px-5 rounded-full border ${
              i18n.language === "ar" ? "text-right" : "text-left"
            }  ${errors.name ? "border-2 border-red-700" : "border-gray-400"}`}
            placeholder={t("name")}
            onChangeText={(value) => updateFormData("name", value)}
            value={formData.name}
            returnKeyType="next"
            onSubmitEditing={() => email_ref.current.focus()}
          />
          {errors.name && (
            <Text style={tw`text-red-500 text-sm mt-1 mx-3`}>
              {errors.name}
            </Text>
          )}
        </View>
        {/* End Name */}

        {/* Start Email */}
        <View>
          <Text style={tw`mb-1 text-gray-700 mx-3`}>{t("email")}</Text>
          <TextInput
            ref={email_ref}
            style={tw`h-[52px] bg-[#eee] px-5 rounded-full border ${
              i18n.language === "ar" ? "text-right" : "text-left"
            }  ${errors.email ? "border-2 border-red-700" : "border-gray-400"}`}
            placeholder={t("email")}
            keyboardType="email-address"
            onChangeText={(value) => updateFormData("email", value)}
            value={formData.email}
            returnKeyType="next"
            onSubmitEditing={() => phone_ref.current.focus()}
          />
          {errors.email && (
            <Text style={tw`text-red-500 text-sm mt-1 mx-3`}>
              {errors.email}
            </Text>
          )}
        </View>
        {/* End Email */}

        {/* Start Phone Number */}
        <View>
          <Text style={tw`mb-1 text-gray-700 mx-3`}>{t("phoneNumber")}</Text>
          <TextInput
            ref={phone_ref}
            style={tw`h-[52px] bg-[#eee] px-5 rounded-full border ${
              i18n.language === "ar" ? "text-right" : "text-left"
            }  ${
              errors.phoneNumber ? "border-2 border-red-700" : "border-gray-400"
            }`}
            placeholder={t("phoneNumber")}
            keyboardType="phone-pad"
            returnKeyType="next"
            onChangeText={(value) => updateFormData("phoneNumber", value)}
            value={formData.phoneNumber}
            onSubmitEditing={() => password_ref.current.focus()}
          />
          {errors.phoneNumber && (
            <Text style={tw`text-red-500 text-sm mt-1 mx-3`}>
              {errors.phoneNumber}
            </Text>
          )}
        </View>
        {/* End Phone Number */}

        {/* Start Password */}
        <View>
          <Text style={tw`mb-1 text-gray-700 mx-3`}>{t("password")}</Text>
          <View style={tw`relative`}>
            <TextInput
              ref={password_ref}
              secureTextEntry={!showPassword}
              style={tw`h-[52px] bg-[#eee] px-5 ${
                i18n.language === "ar" ? "text-right" : "text-left"
              } rounded-full border ${
                errors.password ? "border-2 border-red-700" : "border-gray-400"
              }`}
              placeholder={t("password")}
              returnKeyType="next"
              onChangeText={(value) => updateFormData("password", value)}
              value={formData.password}
              onSubmitEditing={() => confirme_password_ref.current.focus()}
            />
            <TouchableOpacity
              onPress={() => setShowPassword((prev) => !prev)}
              style={[
                tw`absolute ${
                  i18n.language === "ar" ? "left-4" : "right-4"
                } top-1/2`,
                { transform: [{ translateY: -12 }] },
              ]}
            >
              <Ionicons
                name={showPassword ? "eye-off" : "eye"}
                size={22}
                color="#7c7d7e"
              />
            </TouchableOpacity>
          </View>
          {errors.password && (
            <Text style={tw`text-red-500 text-sm mt-1 mx-3`}>
              {errors.password}
            </Text>
          )}
        </View>
        {/* End Password */}

        {/*  Start Confirm Password */}
        <View>
          <Text style={tw`mb-1 text-gray-700 mx-3`}>
            {t("confirm_password")}
          </Text>
          <View style={tw`relative`}>
            <TextInput
              secureTextEntry={!show_confirme_Password}
              ref={confirme_password_ref}
              style={tw`h-[52px] bg-[#eee] px-5 rounded-full border ${
                i18n.language === "ar" ? "text-right" : "text-left"
              } ${
                errors.confirmPassword
                  ? "border-2 border-red-700"
                  : "border-gray-400"
              }`}
              placeholder={t("confirm_password")}
              returnKeyType="done"
              onChangeText={(value) => updateFormData("confirmPassword", value)}
              value={formData.confirmPassword}
              onSubmitEditing={() => Keyboard.dismiss()}
            />
            <TouchableOpacity
              onPress={() => set_show_confirme_Password((prev) => !prev)}
              style={[
                tw`absolute ${
                  i18n.language === "ar" ? "left-4" : "right-4"
                } top-1/2`,
                { transform: [{ translateY: -12 }] },
              ]}
            >
              <Ionicons
                name={show_confirme_Password ? "eye-off" : "eye"}
                size={22}
                color="#7c7d7e"
              />
            </TouchableOpacity>
          </View>
          {errors.confirmPassword && (
            <Text style={tw`text-red-500 text-sm mt-1 mx-3`}>
              {errors.confirmPassword}
            </Text>
          )}
        </View>
        {/*  EndConfirm Password */}

        {/* Start Gender */}
        <View style={tw`flex-row gap-4 items-center`}>
          <Text>{t("gender")}:</Text>
          <TouchableOpacity onPress={() => updateFormData("gender", "male")}>
            <Text
              style={tw`px-4 py-2 rounded-full mr-2 ${
                formData.gender === "male"
                  ? "bg-[#fc6011] text-white"
                  : "bg-gray-200"
              }`}
            >
              {t("male")}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => updateFormData("gender", "female")}>
            <Text
              style={tw`px-4 py-2 rounded-full ${
                formData.gender === "female"
                  ? "bg-[#fc6011] text-white"
                  : "bg-gray-200"
              }`}
            >
              {t("female")}
            </Text>
          </TouchableOpacity>
        </View>
        {/* End Gender */}

        {/* Start Submit Button */}
        <TouchableOpacity
          style={tw`bg-[#fc6011] p-3 rounded-full`}
          onPress={onSubmit}
        >
          <Text style={tw`text-white text-center text-base font-semibold`}>
            {t("register")}
          </Text>
        </TouchableOpacity>
        {/* End Submit Button */}
      </View>
      {/* Start Google Login */}
      <View style={tw``}>
        <Text style={tw`mb-8 mt-8 text-[#7c7d7e] text-center`}>
          {t("or_login_with")}:
        </Text>
        <TouchableOpacity
          style={tw`bg-[#fc6011] rounded-full flex-row py-3 items-center gap-2 justify-center`}
          onPress={() => {
            console.log("");
          }}
        >
          <AntDesign name="google" size={24} color="white" />
          <Text style={tw`text-white text-center `}>
            {t("login_with_google")}
          </Text>
        </TouchableOpacity>
      </View>
      {/* End Google Login */}
      {/* Start have_account */}
      <View style={tw`flex-row items-center mt-8 mx-auto`}>
        <Text>{t("have_account")} </Text>
        <TouchableOpacity
          onPress={() => {
            router.push("/(Auth)/login");
          }}
        >
          <Text style={tw`text-[#fc6011] underline`}>{t("login")} </Text>
        </TouchableOpacity>
      </View>
      {/* End have_account */}
    </View>
  );
}

export default RegisterForm;
