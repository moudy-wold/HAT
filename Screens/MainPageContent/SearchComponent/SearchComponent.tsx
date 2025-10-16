import React from "react";
import { View, Keyboard, TextInput } from "react-native";
import tw from "twrnc";
import { EvilIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useRouter } from "expo-router";

function SearchComponent() {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <View style={tw``}>
      <View
        style={tw`flex-row items-center bg-[#eee] rounded-full px-4 h-[52px]`}
      >
        <EvilIcons name="search" size={28} color="black" style={tw`mb-2`} />
        <TextInput
          style={tw`flex-1 text-[16px]`}
          placeholder={t("search_you_love_food")}
          returnKeyType="done"
          onPress={() => {
            router.push("/(tabs)/search");
          }}
        />
      </View>
    </View>
  );
}

export default SearchComponent;
