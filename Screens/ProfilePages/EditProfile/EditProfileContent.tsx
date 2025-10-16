import { ConfirmOTP, ResendOTP } from "@/api/auth";
import { Edit_info, Get_info } from "@/api/info";
import FetchImageAsFile from "@/components/Global/FetchImageAsFile/FetchImageAsFile";
import Loader from "@/components/Global/Loader/Loader";
import TitleAndBackButton from "@/components/Global/TitleAndBackButton/TitleAndBackButton";
import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Image,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { OtpInput } from "react-native-otp-entry";
import Toast from "react-native-toast-message";
import tw from "twrnc";

const ProfileScreen = () => {
  const { t, i18n } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [imageType, setImageType] = useState("");
  const [avatar, setAvatar] = useState<any>("");
  const [openOtpModal, setOpenOtpModal] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [formData, setFormData] = useState<any>({});
  const [editFormData, setEditFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
  });
  const getInfo = async () => {
    try {
      const res = await Get_info();
      const data = res?.data?.data;
      setFormData(data);
      setAvatar(data?.avatar);
      setIsEmailVerified(data?.email_verified);
      setIsPhoneVerified(data?.phone_verified);
      setImageType(""); // Reset image type when loading existing data

      // Set edit form data
      setEditFormData({
        name: data?.name || "",
        email: data?.email || "",
        phoneNumber: data?.phoneNumber || "",
      });
    } catch (err: any) {
      console.error(err.response.data.message);
    }
  };

  const onSubmit = async () => {
    const submitFormData: any = new FormData();
    console.log("Submitted data:", editFormData);

    // Validate required fields
    if (!editFormData.name.trim()) {
      Toast.show({
        type: "error",
        text1: t("name_is_required"),
      });
      return;
    }

    if (!editFormData.email.trim()) {
      Toast.show({
        type: "error",
        text1: t("email_is_required"),
      });
      return;
    }

    if (!editFormData.phoneNumber.trim()) {
      Toast.show({
        type: "error",
        text1: t("phone_number_is_required"),
      });
      return;
    }

    if (imageType && !avatar.includes("https")) {
      const fileExtension = getFileExtensionFromMimeType(imageType);
      const fileName = `image.${fileExtension}`;

      submitFormData.append("image", {
        uri: avatar,
        type: imageType,
        name: fileName,
      });
    } else if (avatar.includes("https") && imageType) {
      const fileExtension = getFileExtensionFromMimeType(imageType);
      const originalFileName =
        avatar.split("/").pop() || `image.${fileExtension}`;

      // Ensure the filename has correct extension
      let fileName = originalFileName;
      if (!fileName.includes(".")) {
        fileName = `${fileName}.${fileExtension}`;
      } else {
        const nameWithoutExt = fileName.substring(0, fileName.lastIndexOf("."));
        fileName = `${nameWithoutExt}.${fileExtension}`;
      }

      const file = await FetchImageAsFile(avatar, fileName);
      submitFormData.append("image", file);

      console.log("Sending existing image with corrected filename:", fileName);
    }

    submitFormData.append("name", editFormData.name);
    submitFormData.append("email", editFormData.email);
    submitFormData.append("phoneNumber", editFormData.phoneNumber);
    submitFormData.append("_method", "put");

    setIsLoading(true);
    try {
      await Edit_info(submitFormData);
      Toast.show({
        type: "success",
        text1: t("modified_successfully"),
      });
      // Refresh data after successful update
      await getInfo();
    } catch (err: any) {
      console.error("=== Error Details ===");
      console.error("Full error:", err?.response);

      Toast.show({
        type: "error",
        text1:
          err.response?.data?.message ||
          err.message ||
          t("modification_failed"),
      });
    } finally {
      setIsLoading(false);
      setEditModalVisible(false);
    }
  };

  // Helper function to get file extension from mime type
  const getFileExtensionFromMimeType = (mimeType: string): string => {
    const mimeToExt: { [key: string]: string } = {
      "image/jpeg": "jpeg",
      "image/jpg": "jpg",
      "image/png": "png",
      "image/gif": "gif",
      "image/webp": "webp",
    };
    return mimeToExt[mimeType] || "jpeg"; // Default to jpeg if not found
  };

  const handlePickImage = async () => {
    const result: any = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
      console.log(result.assets[0].mimeType, "result.assets[0].mimeType");
      setImageType(result.assets[0].mimeType);
    }
  };
  const handleSendCodeToEmail = async () => {
    setIsLoading(true);
    try {
      await ResendOTP();
      Toast.show({
        type: "success",
        text1: t("code_has_been_sent_to_your_email"),
      });
      setOpenOtpModal(true);
    } catch (err: any) {
      console.error(err?.response, "err?.response");
      Toast.show({
        type: "error",
        text1: err.response?.data?.message || t("failed_to_send_code"),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otpCode.length !== 6) {
      Toast.show({
        type: "error",
        text1: t("please_enter_complete_code"),
      });
      return;
    }

    setIsLoading(true);
    try {
      // هنا يمكنك إضافة API call للتحقق من الكود
      await ConfirmOTP(otpCode);

      Toast.show({
        type: "success",
        text1: t("email_verified_successfully"),
      });
      setTimeout(() => {
        setOpenOtpModal(false);
        setIsEmailVerified(true);
        setOtpCode("");
      }, 1000);
      await getInfo(); // تحديث البيانات
    } catch (err: any) {
      console.error(err?.response, "err?.response");
      Toast.show({
        type: "error",
        text1: err.response?.data?.message || t("invalid_verification_code"),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseOtpModal = () => {
    setOpenOtpModal(false);
    setOtpCode("");
  };

  const handleCancelEdit = () => {
    // Reset form to original data when cancelling
    setEditFormData({
      name: formData?.name || "",
      email: formData?.email || "",
      phoneNumber: formData?.phoneNumber || "",
    });
    setEditModalVisible(false);
  };

  useEffect(() => {
    getInfo();
  }, []);

  return (
    <View
      style={[
        tw`flex-1 p-4`,
        { direction: i18n.language == "ar" ? "rtl" : "ltr" },
      ]}
    >
      {isLoading && <Loader />}
      {/* Start Title && Back Button */}
      <TitleAndBackButton title={t("profile_info")} />
      {/* End Title && Back Button */}

      <View style={tw`flex-1 flex flex-col gap-5 bg-white items-center p-6`}>
        {/* Start Avatart  */}
        <View style={tw`items-center`}>
          <TouchableOpacity
            onPress={() => setEditModalVisible(true)}
            style={tw`border-2 border-gray-200 p-1 rounded-full`}
            activeOpacity={0.7}
          >
            {avatar || formData?.avatar ? (
              <Image
                source={{ uri: avatar || formData?.avatar }}
                style={tw`w-36 h-36 rounded-full`}
              />
            ) : (
              <View
                style={tw`w-36 h-36 rounded-full items-center justify-center bg-gray-100`}
              >
                <Text style={tw`text-gray-500 text-center`}>
                  {t("you_can_add_image")}
                </Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={tw`bg-[#fc6011] mt-1 py-2 px-4 rounded-full`}
            onPress={() => setEditModalVisible(true)}
          >
            <Text style={tw`text-white text-center`}>
              {avatar || formData?.avatar ? t("edit_image") : t("add_image")}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Start Avatart  */}

        {/* Start Name */}
        <View style={tw`w-full mb-4`}>
          <Text style={tw`text-gray-600 mb-1 ml-2`}>{t("name")}</Text>
          <View
            style={tw`flex-row items-center justify-between bg-gray-100 rounded-full px-4 py-4 w-full`}
          >
            <Text style={tw`text-gray-700`}>{formData.name}</Text>
          </View>
        </View>
        {/* End Name */}

        {/* Start Email */}
        <View style={tw`w-full mb-4`}>
          <Text style={tw`text-gray-600 mb-1 ml-2`}>{t("email")}</Text>
          <View
            style={tw`flex-row items-center justify-between bg-gray-100 rounded-full px-4 py-3 w-full`}
          >
            <Text style={tw`text-gray-700`}>{formData.email}</Text>
            {isEmailVerified ? (
              <Feather name="check-circle" size={20} color="green" />
            ) : (
              <TouchableOpacity
                onPress={handleSendCodeToEmail}
                style={tw`flex flex-row gap-1 items-center border-2 p-[2px] rounded-lg border-[#fc6011]`}
              >
                <Text style={tw`text-xs`}>{t("confirm_now")}</Text>
                <Feather name="alert-circle" size={16} color="#fc6011" />
              </TouchableOpacity>
            )}
          </View>
          {!isEmailVerified && (
            <Text style={tw`text-red-500 text-xs ml-2 mt-1`}>
              {t("email_not_confirmed")}
            </Text>
          )}
        </View>
        {/* End Email */}

        {/* Start Phone Number */}
        <View style={tw`w-full mb-4`}>
          <Text style={tw`text-gray-600 mb-1 ml-2`}>{t("phone_number")}</Text>
          <View
            style={tw`flex-row items-center justify-between bg-gray-100 rounded-full px-4 py-3 w-full`}
          >
            <Text style={tw`text-gray-700`}>{formData.phoneNumber}</Text>
            {isPhoneVerified ? (
              <Feather name="check-circle" size={20} color="green" />
            ) : (
              <TouchableOpacity
                onPress={() => console.log("Verify Phone Modal")}
                style={tw`flex flex-row gap-1 items-center border-2 p-[2px] rounded-lg border-[#fc6011]`}
              >
                <Text style={tw`text-xs`}>{t("confirm_now")}</Text>
                <Feather name="alert-circle" size={16} color="#fc6011" />
              </TouchableOpacity>
            )}
          </View>
          {!isPhoneVerified && (
            <Text style={tw`text-red-500 text-xs ml-2 mt-1`}>
              {t("phone_number_not_confirmed")}
            </Text>
          )}
        </View>
        {/* End Phone Number */}

        {/* End Phone Number */}

        <TouchableOpacity
          style={tw`bg-orange-500 w-full py-3 rounded-full mt-6`}
          onPress={() => {
            // Reset form with current data before opening modal
            setEditFormData({
              name: formData?.name || "",
              email: formData?.email || "",
              phoneNumber: formData?.phoneNumber || "",
            });
            setEditModalVisible(true);
          }}
        >
          <Text style={tw`text-white text-center text-base font-bold`}>
            {t("edit_data")}
          </Text>
        </TouchableOpacity>

        {/* Start Edit Info Modal */}
        <Modal visible={editModalVisible} transparent animationType="slide">
          <View
            style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}
          >
            <View style={tw`bg-white w-11/12 p-5 rounded-2xl`}>
              <Text style={tw`text-lg font-bold mb-4 text-center`}>
                {t("edit_profile")}
              </Text>

              {/* Start Avatar */}
              <TouchableOpacity
                style={tw`border-2 border-gray-300 rounded-full w-32 h-32 mx-auto mb-6`}
                onPress={handlePickImage}
              >
                {avatar ? (
                  <Image
                    source={{ uri: avatar }}
                    style={tw`w-full h-full rounded-full`}
                  />
                ) : (
                  <Text style={tw`text-center mt-10 text-gray-500`}>
                    {t("choose_photo")}
                  </Text>
                )}
              </TouchableOpacity>
              <View>
                <Text style={tw`mb-1 ml-1 text-gray-700`}>{t("name")}</Text>
                <TextInput
                  style={tw`border border-gray-300 p-3 rounded-xl mb-3`}
                  onChangeText={(text) => {
                    console.log("Name changed to:", text);
                    setEditFormData((prev) => ({ ...prev, name: text }));
                  }}
                  value={editFormData.name}
                  placeholder="Name"
                />
              </View>
              <View>
                <Text style={tw`mb-1 ml-1 text-gray-700`}>{t("email")}</Text>
                <TextInput
                  style={tw`border border-gray-300 p-3 rounded-xl mb-3`}
                  onChangeText={(text) => {
                    console.log("Email changed to:", text);
                    setEditFormData((prev) => ({ ...prev, email: text }));
                  }}
                  value={editFormData.email}
                  placeholder="Email"
                  keyboardType="email-address"
                />
              </View>
              <View>
                <Text style={tw`mb-1 ml-1 text-gray-700`}>
                  {t("phoneNumber")}
                </Text>
                <TextInput
                  style={tw`border border-gray-300 p-3 rounded-xl mb-3`}
                  onChangeText={(text) => {
                    console.log("Phone changed to:", text);
                    setEditFormData((prev) => ({ ...prev, phoneNumber: text }));
                  }}
                  value={editFormData.phoneNumber}
                  placeholder="Phone Number"
                  keyboardType="phone-pad"
                />
              </View>

              <View style={tw`flex-row justify-between mt-5`}>
                <TouchableOpacity
                  style={tw`bg-gray-300 px-5 py-2 rounded-full`}
                  onPress={handleCancelEdit}
                >
                  <Text>{t("cancel")}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={tw`bg-orange-500 px-5 py-2 rounded-full`}
                  onPress={onSubmit}
                >
                  <Text style={tw`text-white font-bold`}>{t("save")}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        {/* End Edit Modal */}
      </View>

      {/* Start OTP Verification Modal */}
      <Modal visible={openOtpModal} transparent animationType="slide">
        <TouchableWithoutFeedback onPress={handleCloseOtpModal}>
          <View
            style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}
          >
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={tw`bg-white w-11/12 max-w-md p-6 px-3 rounded-2xl`}>
                {/* Header */}
                <View style={tw`items-center mb-6`}>
                  <View
                    style={tw`w-16 h-16 bg-orange-100 rounded-full items-center justify-center mb-4`}
                  >
                    <Feather name="mail" size={32} color="#fc6011" />
                  </View>
                  <Text style={tw`text-xl font-bold text-gray-800 text-center`}>
                    {t("email_verification")}
                  </Text>
                  <Text style={tw`text-gray-600 text-center mt-2`}>
                    {t("enter_verification_code_sent_to")}
                  </Text>
                  <Text style={tw`text-orange-500 font-semibold text-center`}>
                    {formData?.email}
                  </Text>
                </View>

                {/* OTP Input */}
                <View style={tw`mb-6`}>
                  <OtpInput
                    numberOfDigits={6}
                    type="alphanumeric" // ← يسمح بحروف وأرقام
                    onTextChange={setOtpCode}
                    focusColor="#fc6011"
                    focusStickBlinkingDuration={500}
                    textInputProps={{
                      style: tw`text-lg font-bold`,
                      keyboardType: "default", // ← يطلب لوحة مفاتيح الحروف والأرقام
                    }}
                    theme={{
                      containerStyle: tw`mb-4`,
                      pinCodeContainerStyle: tw`w-12 h-12 border-2 border-gray-300 rounded-xl mx-[1px]`,
                      pinCodeTextStyle: tw`text-lg font-bold text-gray-800`,
                      focusStickStyle: tw`bg-orange-500`,
                      focusedPinCodeContainerStyle: tw`border-orange-500`,
                    }}
                  />
                </View>

                {/* Timer and Resend */}
                <View style={tw`items-center mb-6`}>
                  <Text style={tw`text-gray-600 mb-2`}>
                    {t("didn't_receive_code")}
                  </Text>
                  <TouchableOpacity
                    onPress={handleSendCodeToEmail}
                    style={tw`px-4 py-2 rounded-lg`}
                  >
                    <Text style={tw`text-orange-500 font-semibold`}>
                      {t("resend_code")}
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Action Buttons */}
                <View style={tw`flex-row justify-between gap-3`}>
                  <TouchableOpacity
                    style={tw`flex-1 bg-gray-200 py-3 rounded-xl`}
                    onPress={handleCloseOtpModal}
                  >
                    <Text style={tw`text-gray-700 text-center font-semibold`}>
                      {t("cancel")}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={tw`flex-1 ${
                      otpCode.length === 6 ? "bg-orange-500" : "bg-gray-400"
                    } py-3 rounded-xl`}
                    onPress={handleVerifyOtp}
                    disabled={otpCode.length !== 6}
                  >
                    <Text style={tw`text-white text-center font-semibold`}>
                      {t("verify")}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
        <Toast position="top" />
      </Modal>
      {/* End OTP Verification Modal */}
    </View>
  );
};

export default ProfileScreen;
