import { Search } from "@/api/search";
import ItemsSlider from "@/components/Global/ItemsSlider/ItemsSlider";
import Loader from "@/components/Global/Loader/Loader";
import ProductCard from "@/components/Global/ProductCard/ProductCard";
import useStore from "@/store/useStore";
import { AntDesign, EvilIcons } from "@expo/vector-icons";
import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    Keyboard,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import SwiperFlatList from "react-native-swiper-flatlist";
import tw from "twrnc";

function SearchContent({ popular_data, random_meal }: any) {
  const { t, i18n } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [searchValue, setSearchValue] = useState<any>("");
  const searchTimeout = useRef<any>(null);
  const { wishList_ids } = useStore();

  const [meals_page, set_meals_page] = useState(1);
  const [resturant_page, set_resturant_page] = useState(1);
  const [meals_data, set_meals_data] = useState<any>();
  const [resturant_data, set_resturant_data] = useState<any>();
  const hadnleSearch = async (value: any) => {
    setIsLoading(true);
    try {
      const res = await Search(value, meals_page, resturant_page);
      set_meals_data(res?.data?.data?.meals);
      set_resturant_data(res?.data?.data?.vendors);
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTextChange = (text: any) => {
    setSearchValue(text);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      hadnleSearch(text);
    }, 2000);
  };

  const handleSubmitEditing = () => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    hadnleSearch(searchValue);
    Keyboard.dismiss();
  };

  return (
    <View
      style={[tw`p-3`, { direction: i18n.language == "ar" ? "rtl" : "ltr" }]}
    >
      {isLoading && <Loader />}
      {/* Start Search Input */}
      <View
        style={tw`flex-row items-center bg-[#eee] rounded-full px-4 h-[52px]`}
      >
        <EvilIcons name="search" size={28} color="black" style={tw`mb-2`} />
        <TextInput
          style={tw`flex-1 text-[16px]`}
          placeholder={t("search_you_love_food")}
          value={searchValue}
          onChangeText={handleTextChange}
          onSubmitEditing={handleSubmitEditing}
          returnKeyType="search"
        />
        {searchValue.length > 0 && (
          <TouchableOpacity
            onPress={() => {
              setSearchValue("");
              set_meals_data({});
              set_resturant_data({});
              set_meals_page(1), set_resturant_page(1);
            }}
          >
            <AntDesign
              name="closecircle"
              size={20}
              color="gray"
              style={tw`ml-2`}
            />
          </TouchableOpacity>
        )}
      </View>
      {/* End Search Input */}

      {/* Start Popular Words */}
      <View>
        <Text style={tw`mt-3 mb-1 text-lg`}>{t("search_popular")}</Text>
        <SwiperFlatList
          index={0}
          data={popular_data}
          horizontal
          pagingEnabled={false}
          scrollEnabled
          decelerationRate="fast"
          snapToAlignment="center"
          renderItem={({ item }) => (
            <TouchableOpacity
              key={item?.id}
              onPress={() => {
                setSearchValue(item?.keyword);
                hadnleSearch(item?.keyword);
              }}
              style={tw`bg-white border border-gray-300 rounded-md flex-row items-center gap-2 p-1 mx-1`}
            >
              <Text style={tw`text-[#fc6011] px-2 py-1 rounded`}>
                {item?.keyword}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* End Popular Words */}

      {/* Start Search Result */}
      <View>
        {/* Start Meals List */}
        {meals_data?.data?.length && (
          <View>
            <Text style={tw`text-lg mt-4`}>{t("meals_search_result")}</Text>
            {meals_data?.data?.map((meal: any, index: number) => {
              const isFavorite = wishList_ids.includes(meal.id);
              return (
                <View key={index} style={tw``}>
                  <ProductCard
                    item={meal}
                    isFavorite={isFavorite}
                    direction={"horizontal"}
                    meal={true}
                  />
                </View>
              );
            })}
          </View>
        )}
        {/* End Meals List */}

        {/* Start Restuarant List */}
        {resturant_data?.data?.length && (
          <View>
            <Text style={tw`text-lg mt-4`}>{t("resturant_search_result")}</Text>
            {resturant_data?.data?.map((resturant: any, index: number) => {
              const isFavorite = wishList_ids.includes(resturant.id);
              return (
                <View key={index} style={tw``}>
                  <ProductCard
                    item={resturant}
                    isFavorite={isFavorite}
                    direction={"horizontal"}
                    meal={false}
                  />
                </View>
              );
            })}
            {/* End Restuarant List */}
          </View>
        )}
      </View>
      {/* End Search Result */}

      {/* Start Random Meals */}
      <View style={tw`my-3`}>
        <ItemsSlider
          url="url"
          title={t("meals_you_may_like")}
          direction={"horizontal"}
          data={random_meal}
          meal={true}
        />
      </View>
      {/* End Random Meals */}
    </View>
  );
}

export default SearchContent;
