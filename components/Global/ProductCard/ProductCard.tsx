import { Add_Remove_Item } from "@/api/wishlist";
import useStore from "@/store/useStore";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import tw from "twrnc";
import OfferTimer from "../OfferTimer/OfferTimer";

type Props = {
  item: any;
  isFavorite: boolean;
  direction?: "vertical" | "horizontal";
  meal?: boolean;
  targetDate?: any;
  set_update?: any;
};

const ProductCard = ({
  item,
  isFavorite,
  direction,
  meal,
  targetDate,
  set_update,
}: Props) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const { wishList_ids, set_wishList_ids } = useStore();
  const currentDate = new Date();
  const router = useRouter();
  const handleAddOrDeleteTowishList = async (item_id: string) => {
    setIsLoading(true);
    try {
      const res = await Add_Remove_Item(item_id, meal ? "meal" : "vendor");
      let updatedwishlists = [...wishList_ids];

      if (res?.data?.data?.length) {
        Toast.show({
          type: "success",
          text1: meal
            ? t("meal_has_been_added_to_favourites")
            : t("resturant_has_been_added_to_favourites"),
        });
      }

      if (updatedwishlists.includes(item_id)) {
        updatedwishlists = updatedwishlists.filter(
          (id: string) => id !== item_id
        );
        Toast.show({
          type: "success",
          text1: meal
            ? t("meal_has_been_removed_from_favourites")
            : t("resturant_has_been_removed_from_favourites"),
        });
      } else {
        updatedwishlists.push(item_id);
      }
      set_wishList_ids(updatedwishlists);
      set_update((prev: boolean) => !prev);
    } catch (err: any) {
      Toast.show({
        type: "error",
        text1: err.response.data.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TouchableOpacity
      onPress={() => {
        meal
          ? router.push(`/meal/${item?.id}`)
          : router.push(`/(Pages)/resturant/${item?.id}`);
      }}
      style={tw`relative border-2 border-gray-300 rounded-xl overflow-hidden m-2`}
    >
      {/* Start Wishlist Button */}
      <TouchableOpacity
        onPress={(e) => {
          e.stopPropagation?.(); // for RN Gesture safety
          handleAddOrDeleteTowishList(item?.id);
        }}
        style={tw`absolute top-3 ${"ar" == "ar" ? "left-3" : "right-3"} ${
          isFavorite ? "bg-red-500" : "bg-white"
        } p-2 rounded-full z-10 shadow-md`}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#fc6011" />
        ) : (
          <MaterialIcons
            name={isFavorite ? "favorite" : "favorite-border"}
            size={20}
            color={isFavorite ? "white" : "#666"}
          />
        )}
      </TouchableOpacity>
      {/* End Button */}

      {/* Start Product Image */}
      <Image
        source={{ uri: meal ? item?.images?.[0] : item.avatar }}
        style={[
          tw`w-full h-40`,
          {
            resizeMode: direction === "horizontal" ? "stretch" : "cover",
          },
        ]}
      />
      {/* End Product Image */}

      {/* Start Timer */}
      {item?.offer_expiry_date && currentDate < new Date(targetDate) && (
        <View
          style={tw`absolute bottom-0 ${
            "ar" === "ar" ? "right-0" : "left-0"
          } bg-black/60 px-2 py-1 rounded-tl-2xl`}
        >
          <OfferTimer targetDate={item?.offer_expiry_date} />
        </View>
      )}
      {/* End Timer */}

      {/* Start Info */}
      <View style={tw`p-3`}>
        <View style={tw`flex-row justify-between items-center`}>
          <Text style={tw`font-semibold `} numberOfLines={1}>
            {meal ? item?.name : item?.details?.restaurant_name}
          </Text>
          <View style={tw`flex-row items-center gap-1`}>
            <Image
              source={require("../../../assets/images/star.png")}
              style={{ width: 12, height: 12 }}
            />
            <Text style={tw`text-sm text-[#fc6011]`}>
              {item?.average_rating}
            </Text>
            <Text style={tw`text-sm`}>({item?.rating_count})+</Text>
          </View>
        </View>
        {/* End Info */}

        <View style={tw`flex-row justify-between mt-2 items-center`}>
          <Text style={tw`text-gray-500`}>
            {meal
              ? item?.vendor?.details?.restaurant_name
              : item?.vendor?.details?.specialization}
          </Text>
          {meal ? (
            <View style={tw`flex-row items-center gap-1`}>
              {/* {currentDate > new Date(targetDate) && (
                <Text style={tw`line-through text-black text-sm`}>
                  {item?.price}
                </Text>
              )} */}
              <Text style={tw`text-[#fc6011] text-lg`}>
                {currentDate < new Date(targetDate)
                  ? item?.discount_price
                  : item?.price}
              </Text>
              <Text style={tw`ml-1`}>{t("l.s")}</Text>
            </View>
          ) : (
            <View style={tw`flex-row items-center gap-1`}>
              {/* Bicycle Icon يحتاج استبداله بـ Icon صالح لـ RN */}
              <Text style={tw`text-[#fc6011] text-sm`}>
                {t("fast_deleviry")}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ProductCard;
