import { GetAllWishlist } from "@/api/wishlist";
import Loader from "@/components/Global/Loader/Loader";
import ProductCard from "@/components/Global/ProductCard/ProductCard";
import TitleAndBackButton from "@/components/Global/TitleAndBackButton/TitleAndBackButton";
import useStore from "@/store/useStore";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    RefreshControl,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import tw from "twrnc";

function WishlistContent() {
  const { t, i18n } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { wishList_ids } = useStore();
  const [data, setdata] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const getData = async () => {
    setIsLoading(true);
    try {
      const res = await GetAllWishlist();
      setdata(res?.data?.data);
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const onRefresh = async () => {
    if (isLoading || refreshing) return;
    setRefreshing(true);
    try {
      await getData();
    } catch (err) {
      console.error(err);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <View
      style={[tw`p-4`, { direction: i18n.language === "ar" ? "rtl" : "ltr" }]}
    >
      {isLoading && <Loader />}
      {/* Start Title & Back Button */}
      <TitleAndBackButton title={t("wishlist")} />
      {/* End Title & Back Button */}
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#2196f3"]}
          />
        }
      >
        {data?.map((item: any, index: number) => {
          const isFavorite = wishList_ids?.includes(item?.item?.id);
          return (
            <View key={index} style={tw`mb-4`}>
              <ProductCard
                item={item?.item}
                isFavorite={isFavorite}
                direction={"horizontal"}
                meal={item.type === "meal"}
                set_update={setRefreshing}
              />
            </View>
          );
        })}
      </ScrollView>
      {/* Start  List of Items */}

      {/* End  List of Items */}
      {!data?.length && (
        <TouchableOpacity
          style={tw`border-2 border-[#fc6011] rounded-xl mt-5`}
          onPress={() => {
            router.push("/(tabs)");
          }}
        >
          <Text style={tw`text-[#fc6011] text-center text-xl p-3`}>
            {t("start_shopping_now")}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

export default WishlistContent;
