import useStore from "@/store/useStore";
import React from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import tw from "twrnc";
import ProductCard from "../ProductCard/ProductCard";

type Props = {
  title: string;
  url: string;
  data: any[];
  meal?: boolean;
  direction?: "vertical" | "horizontal";
  onEndReached?: any;
  isLoading?: any;
  titleClassName?: any;
};
const ItemsPagination = ({
  title,
  direction,
  meal,
  data,
  onEndReached,
  isLoading,
  titleClassName,
}: Props & { isLoading: boolean }) => {
  const { t } = useTranslation();
  const { wishList_ids } = useStore();

  return (
    <View style={tw``}>
      {/* Title */}
      {title && (
        <Text style={tw`text-lg font-bold px-2 mt-3 ${titleClassName}`}>
          {t(title)}
        </Text>
      )}

      {/* List */}
      <FlatList
        data={data}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        renderItem={({ item }) => {
          const isFavorite = wishList_ids.includes(item.id);
          return (
            <View style={tw`mb-4`} key={item.id}>
              <ProductCard
                item={item}
                isFavorite={isFavorite}
                direction={direction}
                meal={meal}
              />
            </View>
          );
        }}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isLoading ? (
            <View style={tw`py-4`}>
              <ActivityIndicator size="small" color="#2196f3" />
            </View>
          ) : null
        }
      />
    </View>
  );
};

export default ItemsPagination;
