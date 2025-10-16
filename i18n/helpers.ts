import i18n from "@/i18n";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const setLanguage = async (lang: any) => {
  await i18n.changeLanguage(lang);
  await AsyncStorage.setItem("appLanguage", lang);
};
