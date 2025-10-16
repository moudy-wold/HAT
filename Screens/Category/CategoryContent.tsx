import { GetAll_maels_for_sub_by_sub_id } from "@/api/category";
import ItemsPagination from "@/components/Global/ItemsPagination/ItemsPagination";
import Loader from "@/components/Global/Loader/Loader";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Image, Text, TouchableOpacity, View } from "react-native";
import SwiperFlatList from "react-native-swiper-flatlist";
import tw from "twrnc";

type Props = {
  sub_categories: any;
};
function CategoryContent({ sub_categories }: Props) {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [selected_category, set_selected_category] = useState<any>();
  const [sub_category_data, set_sub_category_data] = useState([]);
  const getData = async (id: string) => {
    setIsLoading(true);
    try {
      const res = await GetAll_maels_for_sub_by_sub_id(id);
      set_sub_category_data(res?.data?.data);
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (sub_categories.length) {
      set_selected_category(sub_categories[0]);
      getData(sub_categories[0]?.id);
    }
  }, [sub_categories]);
  return (
    <View style={tw`bg-gray-50 min-h-full`}>
      {isLoading && <Loader />}
      {/* Start sub Categories Slider */}
      <View style={tw`bg-white shadow-sm border-b border-gray-100 py-4 px-2`}>
        <View style={tw`flex-row items-center mb-3`}>
          <View style={tw`w-1 h-5 bg-[#fc6011] rounded mr-2`} />
          <Text style={tw`text-lg font-semibold text-gray-800`}>🍽️ الفئات</Text>
        </View>
        <SwiperFlatList
          index={0}
          data={sub_categories}
          horizontal={true}
          pagingEnabled={false}
          scrollEnabled={true}
          decelerationRate="fast"
          snapToAlignment="center"
          showPagination={false}
          renderItem={({ item }) => {
            const isSelected = selected_category?.id == item?.id;
            return (
              <TouchableOpacity
                key={item?.id}
                onPress={() => {
                  set_selected_category(item);
                  getData(item?.id);
                }}
                style={tw.style(
                  `flex-row items-center gap-3  p-1 mx-2 rounded-xl border-2 shadow-sm`,
                  isSelected
                    ? "bg-[#fc6011] border-[#fc6011] shadow-orange-200"
                    : "bg-white border-gray-200 shadow-gray-100"
                )}
              >
                <View
                  style={tw.style(
                    `w-10 h-10 rounded-full border-2 overflow-hidden`,
                    isSelected ? "border-white" : "border-gray-200"
                  )}
                >
                  <Image
                    source={{ uri: item?.image }}
                    style={tw`w-full h-full`}
                    resizeMode="cover"
                  />
                </View>
                <Text
                  style={tw.style(
                    `font-medium px-1`,
                    isSelected ? "text-white" : "text-gray-700"
                  )}
                >
                  {item?.name}
                </Text>
                {isSelected && (
                  <View style={tw`w-2 h-2 bg-white rounded-full ml-1`} />
                )}
              </TouchableOpacity>
            );
          }}
        />
      </View>
      {/* End sub Categories Slider */}

      {/* Start Show Meals */}
      <View style={tw`flex-1 px-4 pt-4`}>
        {/* Start Meals */}
        {sub_category_data?.length ? (
          <View style={tw`mb-32`}>
            <ItemsPagination
              url={""}
              title={""}
              direction={"horizontal"}
              data={sub_category_data}
              meal={true}
              isLoading={isLoading}
            />
          </View>
        ) : (
          <View
            style={tw`bg-white rounded-xl p-8 items-center shadow-sm border border-gray-100`}
          >
            <View
              style={tw`w-20 h-20 bg-orange-100 rounded-full items-center justify-center mb-4`}
            >
              <MaterialCommunityIcons
                name="food-off"
                size={40}
                color="#fc6011"
              />
            </View>
            <Text
              style={tw`text-xl font-semibold text-gray-800 mb-2 text-center`}
            >
              {t("no_meals_available")}
            </Text>
            <Text style={tw`text-gray-500 text-center leading-5`}>
              {t("no_data_yet_in_this_category")}
            </Text>
            <View style={tw`w-12 h-1 bg-[#fc6011] rounded-full mt-4`} />
          </View>
        )}

        {/* End Meals */}
      </View>
      {/* End Show Meals */}
    </View>
  );
}

export default CategoryContent;
