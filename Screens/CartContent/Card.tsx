import SmallLoader from "@/components/Global/Loader/SmallLoader/Loader";
import { AntDesign } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Image, Text, TouchableOpacity, View } from "react-native";
import tw from "twrnc";
function Card({
  data,
  set_selected_cart,
  handleIncrease,
  handleDecrease,
  isLoadingInc,
  isLoadingDec,
  set_open_delete_item,
}: any) {
  const { t, i18n } = useTranslation();
  const [priceFromData, setPriceFromData] = useState(0);

  useEffect(() => {
    if (data) {
      setPriceFromData(data?.price_at_time * data?.quantity);
    }
  }, [data]);
  return (
    <View
      style={[
        tw`p-2 my-1 border-2 border-gray-200 rounded-md w-full`,
        { direction: i18n.language === "ar" ? "rtl" : "ltr" },
      ]}
    >
      {/* Start Image && Name && Price && Quantiity */}
      <View key={data?.meal?.id} style={tw`flex-row items-center  gap-5`}>
        {/* Start Image */}
        <View>
          <Image
            source={{ uri: data.meal?.images[0] }}
            style={tw`w-20 h-20 rounded-lg `}
          />
        </View>
        {/* End Image */}
        {/* Start Name && Price && Quantiity */}
        <View style={tw``}>
          <Text style={tw`text-lg`}> {data.meal.name}</Text>
          {/* Start Quantity */}
          <Text style={tw`text-lg -mt-[3px] text-[#fc6011]`}>
            {t("the_price")}: {data.meal.price} {t("l.s")}
          </Text>
          {/* End Quantity */}
          {/* Start Quantity */}
          <Text style={tw`mt-1`}>
            {t("the_quantity")}: {data?.quantity}
          </Text>
          {/* End Quantity */}
        </View>
        {/* End Name && Price && Quantiity  */}
      </View>
      {/* End Image && Name && Price && Quantiity */}

      {/* Start Details */}
      <View style={tw`flex flex-col gap-2 w-full my-2`}>
        {data?.details?.map((item: any, ind: number) => {
          return (
            <View
              key={ind}
              style={tw`flex-row items-center justify-between bg-gray-50 border border-gray-300 rounded-lg`}
            >
              <View style={tw`flex-row items-center  px-3 py-2  `}>
                <Text style={tw`text-[#fc6011] font-medium`}>{item?.key}</Text>
                <Text>:</Text>
                <Text style={tw`mx-1`}> {item?.value}</Text>
              </View>
              {/* Start Price */}
              <View style={tw`flex-1 flex-row items-center justify-end px-1`}>
                <Text
                  style={tw`ml-2 $ ${
                    item?.discount_price < item?.price
                      ? "line-through text-xs text-gray-500 "
                      : "text-[#fc6011]"
                  }`}
                >
                  {item?.price}
                </Text>

                {item?.discount_price < item?.price && (
                  <Text style={tw`ml-2 text-[#fc6011]`}>
                    {item?.discount_price}
                  </Text>
                )}
              </View>

              {/* End Price */}
            </View>
          );
        })}
      </View>
      {/* End Details */}

      {/* Start Total Price */}
      <View style={tw`flex-row items-center mx-20`}>
        <Text>{t("total_price")}: </Text>
        <Text style={tw`text-[#fc6011]`}>{priceFromData}</Text>
      </View>
      {/* End Total Price */}

      {/* Start Qunatity  && Remove */}
      <View style={tw` flex-row items-center mx-auto mt-5 gap-4`}>
        <TouchableOpacity
          onPress={() => {
            set_selected_cart(data);
            handleIncrease(data);
          }}
          style={tw`w-10 h-10 items-center justify-center border-2 border-[#fc6011] bg-[#fc6011] rounded-full`}
        >
          {isLoadingInc ? (
            <View
              style={tw`${i18n.language === "ar" ? "pr-[3px]" : "pl-[3px]"}`}
            >
              <SmallLoader />
            </View>
          ) : (
            <Text style={tw`text-white text-xl`}>+</Text>
          )}
        </TouchableOpacity>

        <Text style={tw`text-[#fc6011] font-semibold text-lg`}>
          {data?.quantity}
        </Text>

        <TouchableOpacity
          onPress={() => {
            set_selected_cart(data);
            handleDecrease(data);
          }}
          style={tw`w-10 h-10 items-center justify-center border-2 border-[#fc6011] bg-[#fc6011] rounded-full`}
        >
          {isLoadingDec ? (
            <View
              style={tw`${i18n.language === "ar" ? "pr-[3px]" : "pl-[3px]"}`}
            >
              <SmallLoader />
            </View>
          ) : (
            <Text style={tw`text-white text-3xl`}>-</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            set_selected_cart(data);
            set_open_delete_item(true);
          }}
          style={tw`w-10 h-10 items-center justify-center border-2 border-[#fc6011] rounded-full`}
        >
          <Text style={tw``}>
            <AntDesign name="delete" size={20} color="#fc6011" />
          </Text>
        </TouchableOpacity>
      </View>
      {/* End Qunatity  && Remove */}
    </View>
  );
}

export default Card;
