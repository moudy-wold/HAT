import ar from "@/i18n/locales/ar/common.json";
import en from "@/i18n/locales/en/common.json";
import tr from "@/i18n/locales/tr/common.json";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Localization from "expo-localization";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

export const languageResources = {
  ar: { translation: ar },
  en: { translation: en },
  tr: { translation: tr },
};

const fallbackLng = "en";

// استرجاع اللغة المحفوظة أو لغة الجهاز
const getInitialLanguage = async () => {
  const savedLang = await AsyncStorage.getItem("appLanguage");
  if (savedLang) return savedLang;
  return Localization.getLocales()[0]?.languageCode ?? fallbackLng;
};

(async () => {
  const initialLanguage = await getInitialLanguage();

  i18n.use(initReactI18next).init({
    lng: initialLanguage,
    fallbackLng,
    resources: languageResources,
    interpolation: {
      escapeValue: false,
    },
  });
})();

export default i18n;
