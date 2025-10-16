import useStore from "@/store/useStore";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Dimensions,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SwiperFlatList } from "react-native-swiper-flatlist";
import tw from "twrnc";
import MealModal from "../../../Screens/Meal/MealContent";
import ProductCard from "../ProductCard/ProductCard";

const { width } = Dimensions.get("window");

type Props = {
  title: string;
  url: string;
  data: any[];
  meal?: boolean;
  direction?: "vertical" | "horizontal";
  onEndReached?: any;
  isLoading?: any;
};
const itemWidth = width * 0.82;

const ItemsSlider = ({
  title,
  direction,
  meal,
  data,
  onEndReached,
  isLoading,
}: Props & { isLoading: boolean; onEndReached: () => void }) => {
  const { t, i18n } = useTranslation();
  const { wishList_ids } = useStore();
  const [openMealModal, setOpenMealModal] = useState(false);
  const handleChangeIndex = ({ index }: any) => {
    if (index >= data.length - 5) {
      onEndReached();
    }
  };

  return (
    <View
      style={[tw`mb-2`, { direction: i18n.language === "ar" ? "rtl" : "ltr" }]}
    >
      {/* Title */}
      <Text style={tw`text-lg font-bold px-2`}>{t(title)}</Text>

      {/* List */}
      <View style={{ direction: "ltr" }}>
        <SwiperFlatList
          index={0}
          data={data}
          horizontal
          pagingEnabled={false}
          scrollEnabled
          decelerationRate="fast"
          snapToInterval={itemWidth}
          snapToAlignment="center"
          onChangeIndex={handleChangeIndex}
          renderItem={({ item }) => {
            const isFavorite = wishList_ids.includes(item.id);
            return (
              <View key={item.id} style={{ width: itemWidth }}>
                <ProductCard
                  item={item}
                  isFavorite={isFavorite}
                  direction={direction}
                  meal={meal}
                />
              </View>
            );
          }}
          ListFooterComponent={
            isLoading ? (
              <View style={tw`py-4`}>
                <ActivityIndicator size="small" color="#2196f3" />
              </View>
            ) : null
          }
        />
      </View>
      {/* End  List of Items */}

      {/* Meal Modal */}
      <Modal
        visible={openMealModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setOpenMealModal(false)}
      >
        <View style={tw`flex-1 bg-white p-4 justify-center`}>
          <MealModal meal_id="meal_id" />
          <TouchableOpacity
            style={tw`mt-4 bg-red-500 p-3 rounded-lg self-center`}
            onPress={() => setOpenMealModal(false)}
          >
            <Text style={tw`text-white text-center`}>{t("close")}</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

export default ItemsSlider;
