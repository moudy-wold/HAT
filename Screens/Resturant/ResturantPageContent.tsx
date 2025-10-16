import { Get_All_subCateg_for_Resturant_by_main_category_id } from "@/api/category";
import { Get_Meals_for_Resturant_by_sub_category_id } from "@/api/meals";
import { Add_Remove_Item } from "@/api/wishlist";
import GlobalRating from "@/components/Global/GlobalRating/GlobalRating";
import ItemsPagination from "@/components/Global/ItemsPagination/ItemsPagination";
import useStore from "@/store/useStore";
import { EvilIcons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import SwiperFlatList from "react-native-swiper-flatlist";
import Toast from "react-native-toast-message";
import tw from "twrnc";

function ResturantPageContent({ data, refreshing, setRefreshing }: any) {
  const { t } = useTranslation();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [subCategoryData, setSubCategoryData] = useState([]);
  const [mealsData, setMealsData] = useState([]);
  const [selectedMainCategory, setSelectedMainCategory] = useState<any>();
  const [selectedSubCategory, setSelectedSubCategory] = useState<any>();
  const { wishList_ids, set_wishList_ids } = useStore();
  const isFavorite = wishList_ids.includes(data?.vendor?.id);

  const getSubCategories = async (id: string) => {
    setIsLoading(true);
    try {
      const res = await Get_All_subCateg_for_Resturant_by_main_category_id(
        data?.vendor?.id,
        id
      );
      get_meals(res?.data?.data?.sub_categories[0]?.id);
      setSubCategoryData(res?.data?.data?.sub_categories);
      setSelectedSubCategory(res?.data?.data?.sub_categories[0]);
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const get_meals = async (sub_id: string) => {
    setIsLoading(true);
    try {
      const res = await Get_Meals_for_Resturant_by_sub_category_id(
        data?.vendor?.id,
        sub_id
      );
      setMealsData(res?.data?.data);
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddOrDeleteTowishList = async (item_id: string) => {
    setIsLoading(true);
    try {
      const res = await Add_Remove_Item(item_id, "vendor");
      let updatedwishlists = [...wishList_ids];

      if (res?.data?.data?.length) {
        Toast.show({
          type: "success",
          text1: t("resturant_has_been_added_to_favourites"),
        });

        if (!updatedwishlists.includes(item_id)) {
          updatedwishlists.push(item_id);
        }
      } else {
        Toast.show({
          type: "success",
          text1: t("resturant_has_been_removed_from_favourites"),
        });
        updatedwishlists = updatedwishlists.filter((id) => id !== item_id);
      }
      set_wishList_ids(updatedwishlists);
    } catch (err: any) {
      Toast.show({
        type: "error",
        text1: err.response.data.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getSubCategories(data?.main_categories[0]?.id);
    setSelectedMainCategory(data?.main_categories[0]);
  }, [data]);

  return (
    <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(!refreshing);
          }}
          colors={["#fc6011", "#ff8f42"]}
          tintColor="#fc6011"
        />
      }
      style={[tw`flex-1`, { backgroundColor: "#fafafa" }]}
      contentContainerStyle={tw`pb-6`}
      showsVerticalScrollIndicator={false}
    >
      {/* Start Search && Sliders */}
      <View style={tw`  `}>
        {/* Start Image And Info */}
        <View
          style={[
            tw`mx-3 mb-4 p-4 rounded-2xl`,
            {
              backgroundColor: "#ffffff",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 12,
              elevation: 6,
            },
          ]}
        >
          <View style={tw`flex-row items-center justify-between`}>
            <View style={tw`flex-row items-center flex-1`}>
              {/* Start Image */}
              <View
                style={[
                  tw`p-1 rounded-full flex-row items-center justify-center mr-4`,
                  {
                    backgroundColor: "#fff",
                    shadowColor: "#fc6011",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    elevation: 4,
                  },
                ]}
              >
                <Image
                  source={{ uri: data?.vendor?.avatar }}
                  style={[tw`rounded-full`, { width: 72, height: 72 }]}
                />
                <View
                  style={[
                    tw`absolute -bottom-1 -right-1 w-6 h-6 rounded-full items-center justify-center`,
                    { backgroundColor: "#10b981" },
                  ]}
                >
                  <Text style={tw`text-white text-xs font-bold`}>✓</Text>
                </View>
              </View>
              {/* End Image */}

              {/* Start Name And Rating */}
              <View style={tw`flex-1`}>
                <Text
                  style={[tw`font-bold text-lg mb-2`, { color: "#1f2937" }]}
                >
                  {data?.vendor?.details?.restaurant_name}
                </Text>
                <View style={tw`flex-row items-center mb-1`}>
                  <GlobalRating average_rating={data?.vendor?.average_rating} />
                  <View
                    style={[
                      tw`px-2 py-1 rounded-full ml-2`,
                      { backgroundColor: "#f3f4f6" },
                    ]}
                  >
                    <Text
                      style={[tw`text-xs font-semibold`, { color: "#6b7280" }]}
                    >
                      ({data?.vendor?.rating_count})+
                    </Text>
                  </View>
                </View>
              </View>
              {/* End Image And Info */}
            </View>

            {/* Start Like */}
            <TouchableOpacity
              onPress={(e) => {
                e.stopPropagation?.(); // for RN Gesture safety
                handleAddOrDeleteTowishList(data?.vendor?.id);
              }}
              style={[
                tw`p-3 rounded-full`,
                {
                  backgroundColor: isFavorite ? "#fef2f2" : "#f9fafb",
                  borderWidth: 2,
                  borderColor: isFavorite ? "#fc6011" : "#e5e7eb",
                },
              ]}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#fc6011" />
              ) : (
                <MaterialIcons
                  name={isFavorite ? "favorite" : "favorite-border"}
                  size={24}
                  color={isFavorite ? "#fc6011" : "#6b7280"}
                />
              )}
            </TouchableOpacity>
            {/* End Like */}
          </View>
        </View>
        {/* End Name And Rating */}

        {/* Start Search  */}
        <View style={tw`mx-3 mb-4`}>
          <View
            style={[
              tw`flex-row items-center rounded-2xl px-4 h-14`,
              {
                backgroundColor: "#ffffff",
                borderWidth: 2,
                borderColor: "#f1f5f9",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.08,
                shadowRadius: 8,
                elevation: 4,
              },
            ]}
          >
            <View
              style={[
                tw`w-8 h-8 rounded-full items-center justify-center mr-3`,
                { backgroundColor: "#f8fafc" },
              ]}
            >
              <EvilIcons name="search" size={20} color="#fc6011" />
            </View>
            <TextInput
              style={[tw`flex-1 text-base`, { color: "#374151" }]}
              placeholder={t("search_in_this_resturant")}
              placeholderTextColor="#9ca3af"
              returnKeyType="done"
              onPress={() => {
                router.push("/(tabs)/search");
              }}
            />
          </View>
        </View>
        {/* End Search  */}

        {/* Start Main Categories Slider */}
        <View
          style={[
            tw`mx-3 mb-4 px-3 py-2 rounded-2xl`,
            {
              backgroundColor: "#ffffff",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.08,
              shadowRadius: 8,
              elevation: 4,
            },
          ]}
        >
          <View style={tw` `}>
            <View style={tw`flex-row items-center mb-2`}>
              <View
                style={[
                  tw`w-1 h-6 rounded-full mr-2`,
                  { backgroundColor: "#fc6011" },
                ]}
              />
              <Text style={[tw`font-bold text-lg`, { color: "#1f2937" }]}>
                {t("main_categories")}
              </Text>
            </View>
            <SwiperFlatList
              index={0}
              data={data?.main_categories}
              horizontal={true}
              pagingEnabled={false}
              scrollEnabled={true}
              decelerationRate="fast"
              snapToAlignment="center"
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => {
                const isSelected = selectedMainCategory?.id == item?.id;
                return (
                  <TouchableOpacity
                    key={item?.id}
                    onPress={() => {
                      setSelectedMainCategory(item);
                      getSubCategories(item?.id);
                    }}
                    style={[
                      tw`flex-row items-center rounded-2xl  mx-1`,
                      {
                        backgroundColor: isSelected ? "#fc6011" : "#f8fafc",
                        borderWidth: 2,
                        borderColor: isSelected ? "#fc6011" : "#e2e8f0",
                        shadowColor: isSelected ? "#fc6011" : "#000",
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: isSelected ? 0.3 : 0.1,
                        shadowRadius: 6,
                        elevation: isSelected ? 6 : 2,
                      },
                    ]}
                  >
                    <View
                      style={[
                        tw`w-10 h-10 rounded-full items-center justify-center mr-2`,
                        {
                          backgroundColor: isSelected
                            ? "rgba(255,255,255,0.2)"
                            : "#ffffff",
                          borderWidth: 1,
                          borderColor: isSelected
                            ? "rgba(255,255,255,0.3)"
                            : "#e5e7eb",
                        },
                      ]}
                    >
                      <Image
                        source={{ uri: item?.image }}
                        style={tw`w-7 h-7 rounded-full`}
                      />
                    </View>
                    <Text
                      style={[
                        tw`font-semibold px-1`,
                        {
                          color: isSelected ? "#ffffff" : "#fc6011",
                          minWidth: 60,
                        },
                      ]}
                    >
                      {item?.name}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </View>
        {/* End Main Categories Slider */}

        {/* Start Sub Categories Slider */}
        <View
          style={[
            tw`mx-3 mb-4 px-3 py-2 rounded-2xl`,
            {
              backgroundColor: "#ffffff",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.08,
              shadowRadius: 8,
              elevation: 4,
            },
          ]}
        >
          <View style={tw` `}>
            <View style={tw`flex-row items-center mb-2`}>
              <View
                style={[
                  tw`w-1 h-6 rounded-full mr-2`,
                  { backgroundColor: "#10b981" },
                ]}
              />
              <Text style={[tw`font-bold text-lg`, { color: "#1f2937" }]}>
                {t("sub_categories")}
              </Text>
            </View>
            <SwiperFlatList
              index={0}
              data={subCategoryData}
              horizontal={true}
              pagingEnabled={false}
              scrollEnabled={true}
              decelerationRate="fast"
              snapToAlignment="center"
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => {
                const isSelected = selectedSubCategory?.id == item?.id;
                return (
                  <TouchableOpacity
                    key={item?.id}
                    onPress={() => {
                      setSelectedSubCategory(item);
                      get_meals(item?.id);
                    }}
                    style={[
                      tw`flex-row items-center rounded-2xl mx-1`,
                      {
                        backgroundColor: isSelected ? "#10b981" : "#f0fdf4",
                        borderWidth: 2,
                        borderColor: isSelected ? "#10b981" : "#d1fae5",
                        shadowColor: isSelected ? "#10b981" : "#000",
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: isSelected ? 0.3 : 0.1,
                        shadowRadius: 6,
                        elevation: isSelected ? 6 : 2,
                      },
                    ]}
                  >
                    <View
                      style={[
                        tw`w-10 h-10 rounded-full items-center justify-center mr-2`,
                        {
                          backgroundColor: isSelected
                            ? "rgba(255,255,255,0.2)"
                            : "#ffffff",
                          borderWidth: 1,
                          borderColor: isSelected
                            ? "rgba(255,255,255,0.3)"
                            : "#d1fae5",
                        },
                      ]}
                    >
                      <Image
                        source={{ uri: item?.image }}
                        style={tw`w-7 h-7 rounded-full`}
                      />
                    </View>
                    <Text
                      style={[
                        tw`font-semibold px-1`,
                        {
                          color: isSelected ? "#ffffff" : "#10b981",
                          minWidth: 60,
                        },
                      ]}
                    >
                      {item?.name}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </View>
        {/* End Sub Categories Slider */}
      </View>
      {/* End Search && Sliders */}

      {/* Start Show Meals */}
      <View style={tw`px-2 `}>
        <ItemsPagination
          url={""}
          title={""}
          direction={"horizontal"}
          data={mealsData}
          meal={true}
          isLoading={false}
          titleClassName={"mt-0"}
        />
      </View>
      {/* End Show Meals */}
    </ScrollView>
  );
}

export default ResturantPageContent;
