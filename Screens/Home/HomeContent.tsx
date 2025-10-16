import LanguageSelector from "@/components/Global/LanguageSelector/LanguageSelector";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "twrnc";

function HomePage() {
  const { t } = useTranslation();
  const router = useRouter();
  const check_loggin = async () => {
    const login = await AsyncStorage.getItem("isLogend");
    if (login) {
      router.replace("/(tabs)");
    }
  };

  useEffect(() => {
    check_loggin();
  }, []);

  return (
    <SafeAreaView>
      <View style={tw``}>
        <View style={tw`relative `}>
          {/* Start Image */}
          <Image
            source={require("../../assets/images/new_custom_filtered.png")}
            style={[tw`h-[380px] w-full  `, { objectFit: "contain" }]}
          />
          {/* End Image */}

          {/* Start Logo */}
          <View
            style={tw`flex flex-col items-center justify-center left-[33%] border-0 -top-28 w-32`}
          >
            <Image
              source={require("../../assets/images/logo.png")}
              style={[tw` w-40 h-40 `, {}]}
            />
            <Text style={tw`text-[#fc6011] text-lg -mt-8 `}>هات طلبك...</Text>
          </View>
          {/* End Logo */}
        </View>

        {/* Start desc */}
        <Text style={tw`px-10 text-center -mt-20 text-[#7c7d7e]`}>
          {t(
            "discover_the_best_foods_from_over_1000_restaurants_and_fast_delivery_to_your_doorstep"
          )}
        </Text>
        {/* End Desc */}

        {/* Start Buttons */}
        <View style={tw`mx-5 flex flex-col gap-5 my-10`}>
          {/* Start Login Button */}
          <TouchableOpacity
            onPress={() => {
              router.push("/(Auth)/login");
            }}
          >
            <Text
              style={tw`bg-[#fc6011] text-white text-lg  text-center py-[8px] rounded-full `}
            >
              {t("login")}
            </Text>
          </TouchableOpacity>
          {/* End Login Button */}
          {/* Start Register Button */}
          <TouchableOpacity
            onPress={() => {
              router.push("/(Auth)/register");
            }}
          >
            <Text
              style={tw`bg-[#fff] text-[#fc6011] text-lg border-2 border-[#fc6011] text-center py-[6px] rounded-full `}
            >
              {t("create_account")}
            </Text>
          </TouchableOpacity>
          {/* End Register Button */}
          {/* Start Langauge */}
          <View
            style={tw`flex-row justify-center border-[1px] border-[#fc6011] rounded-xl w-14 mx-auto`}
          >
            <LanguageSelector />
          </View>
          {/* End Langauge */}
        </View>
        {/* End Buttons */}
      </View>
    </SafeAreaView>
  );
}

export default HomePage;
