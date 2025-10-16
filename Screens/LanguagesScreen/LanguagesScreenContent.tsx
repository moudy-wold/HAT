import TitleAndBackButton from "@/components/Global/TitleAndBackButton/TitleAndBackButton";
import { languages } from "@/constants/constants";
import { setLanguage } from "@/i18n/helpers";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { Pressable, Text, View } from "react-native";
import tw from "twrnc";

function LanguagesScreenContent() {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;

  const handleSelect = async (lang: any) => {
    await setLanguage(lang);
  };
  return (
    <View
      style={[
        tw` bg-white h-full`,
        {
          direction: i18n.language === "ar" ? "rtl" : "ltr",
        },
      ]}
    >
      {/* Start Title && Back Button */}
      <View style={tw`px-4 pt-2`}>
        <TitleAndBackButton title={t("languages")} />
      </View>
      {/* End Title && Back Button */}
      <Text style={tw`text-xl font-bold mb-4 text-center`}>
        {t("choose_app_language")}
      </Text>

      {languages.map((lang) => (
        <Pressable
          key={lang.code}
          onPress={() => handleSelect(lang.code)}
          style={tw`p-3 flex-row justify-between items-center border-b border-gray-200`}
        >
          <Text style={tw`text-lg`}>{lang.label}</Text>
          {currentLang === lang.code && (
            <Ionicons name="checkmark" size={20} color="green" />
          )}
        </Pressable>
      ))}
    </View>
  );
}

export default LanguagesScreenContent;
