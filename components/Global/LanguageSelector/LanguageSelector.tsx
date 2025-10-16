import { languages } from "@/constants/constants";
import i18n from "@/i18n";
import { setLanguage } from "@/i18n/helpers";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
    Modal,
    Pressable,
    Text,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import tw from "twrnc";

export default function LanguageSelector() {
  const { t } = useTranslation();

  const [modalVisible, setModalVisible] = useState(false);
  const currentLang = i18n.language; // اللغة الحالية

  const handleSelect = async (lang: any) => {
    await setLanguage(lang);
    setModalVisible(false);
  };

  return (
    <View>
      <Pressable onPress={() => setModalVisible(true)} style={tw`p-2`}>
        <Ionicons name="globe-outline" size={28} color="#fc5f11e0" />
      </Pressable>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={tw`flex-1 bg-black/50 justify-center items-center`}>
            <View style={tw`bg-white rounded-2xl p-6 w-3/4`}>
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

              <Pressable
                onPress={() => setModalVisible(false)}
                style={tw`mt-4 bg-gray-200 rounded-xl p-3`}
              >
                <Text style={tw`text-center text-red-500`}>إغلاق</Text>
              </Pressable>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}
