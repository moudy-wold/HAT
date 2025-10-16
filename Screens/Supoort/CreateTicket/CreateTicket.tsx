import { Create_ticket } from "@/api/ticket";
import Loader from "@/components/Global/Loader/Loader";
import TitleAndBackButton from "@/components/Global/TitleAndBackButton/TitleAndBackButton";
import * as DocumentPicker from "expo-document-picker";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";
import tw from "twrnc";

type FieldType = {
  subject: string;
  file: any;
  description: string;
};

function CreateTicket() {
  const { t } = useTranslation();
  const router: any = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const validImageTypes = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "image/webp",
  ];
  const [formValues, setFormValues] = useState<any>({
    subject: "",
    description: "",
    file: null,
  });

  const desriptio_ref = useRef<any>(null);
  const handleInputChange = (field: any, value: any) => {
    setFormValues((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = async () => {
    try {
      const result: any = await DocumentPicker.getDocumentAsync({
        type: "*/*",
      });
      if (!result.canceled) {
        if (
          validImageTypes.includes(result?.assets[0]?.mimeType) ||
          result?.assets[0]?.mimeType.startsWith("application/")
        ) {
          setFormValues((prev: any) => ({ ...prev, file: result }));
        } else {
          alert("يرجى اختيار صورة بصيغة JPEG/PNG أو ملف مناسب.");
        }
      }
    } catch (error) {
      console.log("File upload error:", error);
    }
  };

  const onFinish = async ({ subject, file, description }: FieldType) => {
    setIsLoading(true);
    const formData: any = new FormData();
    console.log(formValues.file.assets[0]);

    formData.append("subject", subject);

    formData.append("file", {
      uri: formValues.file.assets[0].uri,
      type: formValues.file.assets[0].mimeType,
      name: "image",
    });
    formData.append("description", description);

    try {
      await Create_ticket(formData);
      Toast.show({
        type: "success",
        text1: t("sended_message_successfully"),
      });
      router.back();
    } catch (err: any) {
      console.log(err, "errorrr");
      Toast.show({
        type: "error",
        text1: err.response.data.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = () => {
    onFinish(formValues);
  };
  return (
    <View style={tw`p-4`}>
      {isLoading && <Loader />}
      {/* Start Title */}
      <TitleAndBackButton title={t("create_support")} />
      {/* End Title */}
      {/* Start Subject */}
      <View style={tw`mb-4`}>
        <Text style={tw`text-sm md:text-base mb-2`}>{t("title")}</Text>
        <TextInput
          style={tw`border border-gray-300 rounded-[8px] p-3`}
          placeholder={t("please_enter_title")}
          value={formValues.subject}
          onChangeText={(value) => handleInputChange("subject", value)}
          onSubmitEditing={() => desriptio_ref.current.focus()}
          returnKeyType="next"
        />
      </View>
      {/* End Subject */}
      {/* Start Description */}
      <View style={tw`mb-4`}>
        <Text style={tw`text-sm md:text-base mb-2`}>{t("description")}</Text>
        <TextInput
          style={tw`border border-gray-300 rounded-[8px] p-3`}
          placeholder={t("please_enter_description")}
          value={formValues.description}
          onChangeText={(value) => handleInputChange("description", value)}
          multiline
          numberOfLines={4}
          ref={desriptio_ref}
        />
      </View>
      {/* End Description */}

      {/* Start File Upload */}
      <View style={tw`mb-4`}>
        <Text style={tw`text-sm md:text-base mb-2`}>
          {t("image_or_file_of_problem")}
        </Text>

        <TouchableOpacity
          style={tw`flex-row items-center justify-between bg-[#f6f6f6] border border-gray-300 rounded-[8px] p-3`}
          onPress={handleFileUpload}
        >
          <Text>{t("please_enter_file_or_image")} </Text>
        </TouchableOpacity>

        {formValues.file && (
          <>
            {formValues.file.assets[0].mimeType.includes("image") ? (
              <View style={tw`border-2 border-gray-300 p-2 rounded-md my-3`}>
                <Image
                  source={{ uri: formValues.file.assets[0].uri }}
                  style={[
                    tw`w-[320px] h-36 rounded-md mx-auto`,
                    { objectFit: "contain" },
                  ]}
                />
              </View>
            ) : (
              <Text style={tw`mt-2 text-sm text-gray-500`}>
                {t("file_selected")}: {formValues.file.assets[0].name}
              </Text>
            )}
            {/* Start Remove File */}
            <TouchableOpacity
              onPress={() => handleInputChange("file", null)}
              style={tw`mt-2 bg-red-500 p-2 rounded-md`}
            >
              <Text style={tw`text-white text-center`}>{t("delete_file")}</Text>
            </TouchableOpacity>
            {/* End Remove File */}
          </>
        )}
      </View>
      {/* End File Upload */}

      {/* Submit Button */}
      <TouchableOpacity
        onPress={handleSubmit}
        style={tw`mt-3 rounded-full  py-[6px] text-center bg-[#fc6011] border-2 border-[#fc6011]`}
      >
        <Text style={tw`text-center text-lg  text-white`}>{t("send")}</Text>
      </TouchableOpacity>
    </View>
  );
}

export default CreateTicket;
