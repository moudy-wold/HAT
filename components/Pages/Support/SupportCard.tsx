import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import {
  Image,
  Linking,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import tw from "twrnc";

function SupportCard({ item, setOpenFile, setFile }: any) {
  const { t, i18n } = useTranslation();
  const router = useRouter();

  const isImage = (fileUrl: string) => {
    const imageExtensions = [".png", ".jpg", ".jpeg", ".webp", ".gif"];
    return imageExtensions.some((ext) => fileUrl.toLowerCase().endsWith(ext));
  };
  return (
    <View
      style={[
        tw`p-[6px] rounded-md border-[#fc6011] border-2 my-2`,
        { direction: i18n.language == "ar" ? "rtl" : "ltr" },
      ]}
    >
      {/* Start subject */}
      <View style={tw`my-1 flex-row items-center`}>
        <Text style={tw`w-20 text-sm`}>{t("subject")}</Text>
        <Text style={tw`underline`}>{item?.subject}</Text>
      </View>
      {/* End subject */}

      {/* Start status */}
      <View style={tw`my-1 flex-row items-center`}>
        <Text style={tw`w-20 text-sm`}>{t("the_status")}</Text>
        <Text style={tw`w-fit bg-[#fc6011] text-white rounded-lg p-2`}>
          {item?.status}
        </Text>
      </View>
      {/* End status */}

      {/* Start file */}
      <TouchableOpacity
        onPress={() => {
          setOpenFile(true);
          setFile(item?.file);
        }}
        style={tw`my-1`}
      >
        {isImage(item?.file) ? (
          <Image
            source={{ uri: item?.file }}
            style={[
              tw`w-[320px] h-36 rounded-md mx-auto`,
              { objectFit: "contain" },
            ]}
          />
        ) : (
          <TextInput
            value={item?.file}
            editable={false}
            style={tw`border border-[#fc6011] rounded-md p-2 text-blue-600`}
            onPressIn={() => Linking.openURL(item?.file)}
          />
        )}
      </TouchableOpacity>
      {/* End file */}

      {/* Start description */}
      <View style={tw`my-2`}>
        <Text style={tw`text-center`}>{item?.description}</Text>
      </View>
      {/* End description */}

      {/* Start Action */}
      <View style={tw`flex-row items-center justify-center`}>
        <TouchableOpacity
          onPress={() => {
            router.replace(`/(Pages)/support/${item?.id}`);
          }}
          style={tw`border-2 border-[#fc6011] rounded-md p-1 flex-row items-center justify-center`}
        >
          <Feather name="eye" size={24} color="#fc6011" />
        </TouchableOpacity>
      </View>
      {/* End Action */}
    </View>
  );
}

export default SupportCard;
