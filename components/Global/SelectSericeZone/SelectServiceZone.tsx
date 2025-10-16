import { useTranslation } from "react-i18next";
import {
  FlatList,
  Modal,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import tw from "twrnc";

export default function CustomPicker({
  data,
  handleChangeZone,
  isOpen,
  onClose,
}: any) {
  const { t, i18n } = useTranslation();
  return (
    <Modal visible={isOpen} transparent animationType="slide">
      <TouchableWithoutFeedback onPress={onClose}>
        <View
          style={[
            tw`flex-1 justify-center items-center bg-black bg-opacity-50`,
            { direction: i18n.language === "ar" ? "rtl" : "ltr" },
          ]}
        >
          <View style={tw`bg-white rounded-lg p-4 w-3/4 max-h-80`}>
            <Text style={tw`text-lg font-bold mb-4 `}>
              {t("choose_the_city")}
            </Text>
            <FlatList
              data={data}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={tw`p-2 border-b border-gray-300`}
                  onPress={() => handleChangeZone(item)}
                >
                  <Text style={tw`text-lg`}>{t(item.name)}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
