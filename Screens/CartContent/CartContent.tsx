import { Ddelte_Cart, GetAllCart, Update_quantity } from "@/api/cart";
import Loader from "@/components/Global/Loader/Loader";
import TitleAndBackButton from "@/components/Global/TitleAndBackButton/TitleAndBackButton";
import OrderSummary from "@/components/Pages/Cart/OrderSummary/OrderSummary";
import useStore from "@/store/useStore";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Image,
  Modal,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import tw from "twrnc";
import Card from "./Card";

function CartContent() {
  const { t, i18n } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<any>({});
  const [selected_cart, set_selected_cart] = useState<any>({});
  const [isLoadingInc, setIsLoadingInc] = useState(false);
  const [isLoadingDec, setIsLoadingDec] = useState(false);
  const [open_summary, set_open_summary] = useState(false);
  const [open_delete_item, set_open_delete_item] = useState(false);
  const [update, setUpdate] = useState(false);
  const [order_summary, set_order_summary] = useState({
    cart_items_count: 0,
    cart_items_length: 0,
    total_price: 0,
    deliveryFee: 0,
    grand_total: 0,
  });
  const [refreshing, setRefreshing] = useState(false);

  const router = useRouter();
  const { cart_length, set_cart_length_manual } = useStore();

  const getOrderSummary = useCallback((response: any) => {
    const cart_items = response?.data?.cart_items || [];
    const cart_items_count = response?.cart_items_count || 0;
    const deliveryFee = parseFloat(response?.data?.delivery_fee) || 0;
    const total_price = parseFloat(response?.data?.total_price) || 0;

    let cart_items_length = 0;
    cart_items.forEach((item: any) => {
      cart_items_length += item?.quantity;
    });

    const grand_total = total_price + deliveryFee;

    return {
      cart_items_count,
      cart_items_length,
      total_price,
      deliveryFee,
      grand_total,
    };
  }, []);

  const handleDeleteItem = async () => {
    setIsLoading(true);
    set_open_delete_item(false);
    try {
      await Ddelte_Cart(selected_cart?.id);
      Toast.show({
        type: "success",
        text1: t("item_has_been_removed_from_cart"),
      });
      set_cart_length_manual(cart_length - selected_cart?.quantity);

      setData((prev: any) => ({
        ...prev,
        data: {
          ...prev.data,
          cart_items: prev.data.cart_items.filter(
            (item: any) => item?.id !== selected_cart?.id
          ),
        },
      }));
    } catch (err: any) {
      console.error(err);
      Toast.show({
        type: "success",
        text1: err.response?.data?.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleIncrease = async (data: any) => {
    setIsLoadingInc(true);
    try {
      await Update_quantity(data?.id, +data?.quantity + 1);
      setData((prev: any) => ({
        ...prev,
        data: {
          ...prev.data,
          cart_items: prev.data.cart_items.map((item: any) =>
            item?.id === selected_cart?.id
              ? { ...item, quantity: item?.quantity + 1 }
              : item
          ),
        },
      }));

      Toast.show({
        type: "success",
        text1: t("number_has_been_increased"),
      });

      set_cart_length_manual(+cart_length + 1);
      setUpdate(!update);
    } catch (err: any) {
      console.error(err);
      Toast.show({
        type: "error",
        text1: err.response?.data?.message,
      });
    } finally {
      setIsLoadingInc(false);
    }
  };

  const handleDecrease = async (data: any) => {
    setIsLoadingDec(true);
    try {
      await Update_quantity(data?.id, +data?.quantity - 1);
      set_cart_length_manual(+cart_length - 1);

      if (data.quantity === 0) {
        Toast.show({
          type: "success",
          text1: t("item_has_been_removed_from_cart"),
        });
      } else {
        Toast.show({
          type: "success",
          text1: t("number_has_been_reduced"),
        });
        setData((prev: any) => ({
          ...prev,
          data: {
            ...prev.data,
            cart_items: prev.data.cart_items.map((item: any) =>
              item?.id === selected_cart?.id
                ? { ...item, quantity: item?.quantity - 1 }
                : item
            ),
          },
        }));
      }
      setUpdate(!update);
    } catch (err: any) {
      console.error(err);
      Toast.show({
        type: "error",
        text1: err.response?.data?.message,
      });
    } finally {
      setIsLoadingDec(false);
    }
  };

  const getData = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await GetAllCart();
      setData(res?.data);
      const summary = getOrderSummary(res?.data);
      set_order_summary(summary);
    } catch (err: any) {
      console.log(err.resposne.data);
    } finally {
      setIsLoading(false);
    }
  }, [getOrderSummary]);

  useEffect(() => {
    getData();
  }, [update]);

  const onRefresh = async () => {
    setRefreshing(true);
    await getData();
    setRefreshing(false);
  };

  return (
    <View
      style={[tw` p-4`, { direction: i18n.language == "ar" ? "rtl" : "ltr" }]}
    >
      {isLoading && <Loader />}

      {/* Start Title */}
      <TitleAndBackButton title={t("cart")} />
      {/* End Title */}

      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#2196f3"]}
          />
        }
        style={tw` h-[98%] `}
      >
        {/* Start Vendor Info */}
        {data?.data?.cart_items?.length && (
          <TouchableOpacity
            onPress={() => {
              router.push(`/resturant/${data?.data?.vendor?.id}`);
            }}
            style={tw`flex-row items-center justify-center gap-3 my-1`}
          >
            {/* Start Avatar */}
            <View style={tw`p-1 rounded-full border-[1px] border-[#fc6011]`}>
              <Image
                source={{ uri: data?.data?.vendor?.avatar }}
                style={tw`w-14 h-14 rounded-full`}
              />
            </View>
            {/* End Avatar */}

            {/* Start Name */}
            <Text style={tw`text-lg`}>{data?.data?.vendor?.name}</Text>
            {/* End Name */}
          </TouchableOpacity>
        )}
        {/* End Vendor Info */}

        {/* Start Meal List */}
        {data?.data?.cart_items?.map((item: any) => (
          <View key={item?.id} style={tw`flex-row items-center gap-5`}>
            <Card
              data={item}
              set_selected_cart={set_selected_cart}
              handleIncrease={handleIncrease}
              handleDecrease={handleDecrease}
              isLoadingInc={isLoadingInc}
              isLoadingDec={isLoadingDec}
              set_open_delete_item={set_open_delete_item}
            />
          </View>
        ))}
        {/* End Meal List */}

        {/* Start Open Address Buttom */}
        {data?.data?.cart_items?.length ? (
          <View style={tw`p-2 my-4`}>
            <TouchableOpacity
              onPress={() => {
                router.push("/(Pages)/confirmeOrder");
                // set_open_address(true);
              }}
              style={tw`bg-[#fc6011] p-3 px-16 rounded-xl`}
            >
              <Text style={tw`text-white text-center `}>
                {t("confirm_order")}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
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
        {/* End Open Address Buttom */}
      </ScrollView>

      {/* Start Open Summary Button */}
      <TouchableOpacity
        onPress={() => {
          if (data?.data?.cart_items?.length) {
            set_open_summary(true);
          }
        }}
        style={tw`py-2 -mt-2`}
      >
        <View
          style={tw`p-3 shadow-2xl border-[#fc6011] border-[1px] rounded-lg bg-[#fff] `}
        >
          <Text style={tw`text-[#fc6011] text-center`}>
            {t("order_summary")}
          </Text>
        </View>

        <View style={tw`flex shadow-2xl flex-row justify-between `}>
          <Text style={tw`text-xl font-bold`}>{t("grand_total")}:</Text>
          <Text style={tw`text-xl font-bold`}>
            {order_summary?.grand_total}
          </Text>
        </View>
      </TouchableOpacity>
      {/* End Open Summary Button */}

      {/* Start Order Summary Modal */}
      <Modal
        transparent
        visible={open_summary}
        animationType="slide"
        onRequestClose={() => set_open_summary(false)}
      >
        <Pressable style={tw`flex-1`} onPress={() => set_open_summary(false)}>
          <View style={tw`flex-1 justify-end mb-10`}>
            <View style={tw``}>
              <OrderSummary order_summary={order_summary} />
            </View>
          </View>
        </Pressable>
      </Modal>
      {/* End Order Summary Modal */}

      {/* Start Remove Meal Modal */}
      <Modal transparent animationType="fade" visible={open_delete_item}>
        <TouchableWithoutFeedback onPress={() => set_open_delete_item(false)}>
          <View style={tw`flex-1 justify-center items-center bg-black/50`}>
            <View style={tw`w-4/5 bg-white rounded-lg p-3 items-center`}>
              <Text style={tw`mb-4 text-black text-base font-bold`}>
                {t("are_you_sure_you_want_delete_this_item")}
              </Text>
              <View style={tw`flex-row justify-between mt-4`}>
                <TouchableOpacity
                  style={tw`bg-red-500 rounded-lg py-2 px-5 mx-2`}
                  onPress={() => handleDeleteItem()}
                >
                  <Text style={tw`text-white`}>{t("confirm")}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={tw`bg-gray-400 rounded-lg py-2 px-5 mx-2`}
                  onPress={() => set_open_delete_item(false)}
                >
                  <Text style={tw`text-white`}>{t("cancel")}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      {/* End Remove Meal Modal */}

      {/* Start Confirme Order Modal */}
      {/* <Modal
        transparent
        visible={open_address}
        animationType="slide"
        onRequestClose={() => set_open_address(false)}
        style={{ width: "80%", margin: "auto", borderRadius: 8 }}
      >
        <Pressable
          style={tw`w-[90%] mx-auto mt-10 h-[90%] shadow-2xl rounded-xl `}
          onPress={() => set_open_address(false)}
        >
          <View style={tw`bg-white flex-1 justify-end`}>
            <AddressForm />
          </View>
        </Pressable>
      </Modal> */}
      {/* End Confirme Order Modal */}
    </View>
  );
}

export default CartContent;
