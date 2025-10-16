import React from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import tw from "twrnc";

export default function OrderSummary({ order_summary }: any) {
  const { t } = useTranslation();
  return (
    <View
      style={tw`bg-white flex-col gap-4 border-2 border-gray-300 p-2 rounded-lg`}
    >
      {/* Start Type Length */}
      <View style={tw`flex flex-row justify-between mb-1`}>
        <Text style={tw`text-lg`}>{t("types_count")}:</Text>
        <Text style={tw`text-lg`}>{order_summary?.cart_items_count}</Text>
      </View>
      {/* End Type Length */}

      {/* Start Quantity */}
      <View style={tw`flex flex-row justify-between mb-1`}>
        <Text style={tw`text-lg`}>{t("total_count")}:</Text>
        <Text style={tw`text-lg`}>{order_summary?.cart_items_length}</Text>
      </View>
      {/* End Quantity */}

      {/* Start Total Price */}
      <View style={tw`flex flex-row justify-between mb-1`}>
        <Text style={tw`text-lg`}>{t("total_price")}:</Text>
        <Text style={tw`text-lg`}>
          {order_summary?.total_price} {t("l.s")}
        </Text>
      </View>
      {/* End Total Price */}

      {/* Start Delivery Fee */}
      <View style={tw`flex flex-row justify-between mb-1`}>
        <Text style={tw`text-lg`}>{t("delivery_fee")}:</Text>
        <Text style={tw`text-lg`}>
          {order_summary?.deliveryFee}
          <Text style={tw`text-xs`}> {t("l.s")} 00</Text>
        </Text>
      </View>
      {/* End Delivery Fee */}

      {/* Start Grand Total */}
      <View style={tw`flex flex-row justify-between mt-2`}>
        <Text style={tw`text-xl font-bold`}>{t("grand_total")}:</Text>
        <Text style={tw`text-xl font-bold`}>
          {/* {order_summary?.total_price + order_summary?.deliveryFee} */}
          {order_summary?.grand_total}
        </Text>
      </View>
      {/* End Grand Total */}
    </View>
  );
}
