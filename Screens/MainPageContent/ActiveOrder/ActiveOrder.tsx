import { GetAllOrder } from "@/api/order";
import MyOrderCard from "@/components/Pages/MyOrder/MyOrderCard";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { TouchableOpacity, View } from "react-native";
import tw from "twrnc";
function ActiveOrder() {
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  const [showInfo, setShowInfo] = useState(false);
  const getData = async () => {
    try {
      const res = await GetAllOrder(["pending", "preparing", "on_the_way"], 1);
      setData(res?.data?.data);
    } catch (err: any) {
      console.error(err);
    }
  };
  useEffect(() => {
    getData();
  }, []);
  return (
    <View style={tw`px-4 pb-1`}>
      {data?.map((item: any, index: number) => (
        <TouchableOpacity
          onPress={() => {
            setShowInfo(!showInfo);
          }}
          key={index}
        >
          <MyOrderCard item={item} t={t} show_info={showInfo} />
        </TouchableOpacity>
      ))}
    </View>
  );
}

export default ActiveOrder;
