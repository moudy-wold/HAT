import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import { View, Text, TouchableOpacity } from "react-native";
import tw from "twrnc";
type Props = {
  title: string;
};
function TitleAndBackButton({ title }: Props) {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  return (
    <View
      style={[
        tw` flex-row items-center justify-between  gap-5 mb-2`,
        { direction: i18n.language == "ar" ? "rtl" : "ltr" },
      ]}
    >
      {/* Start Title*/}
      <Text style={tw`text-2xl px-3 font-semibold`}>{title}</Text>
      {/* End Title*/}
      {/* Start Arrow */}
      <TouchableOpacity
        onPress={() => {
          router.back();
        }}
        style={tw``}
      >
        <MaterialIcons
          name="keyboard-arrow-right"
          size={36}
          color="#3e3e3e"
          style={{
            transform: [{ rotate: i18n.language === "ar" ? "180deg" : "0deg" }],
          }}
        />
      </TouchableOpacity>
      {/* End Arrow */}
    </View>
  );
}

export default TitleAndBackButton;
