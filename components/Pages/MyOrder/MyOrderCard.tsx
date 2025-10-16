import { Resend_order } from "@/api/order";
import AccordionSection from "@/components/Global/AccordionSection/AccordionSection";
import Loader from "@/components/Global/Loader/Loader";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Modal,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import tw from "twrnc";
import OrderStatusLine from "./StatusLine";
type Props = {
  item: any;
  t: any;
  show_info?: boolean;
};
function MyOrderCard({ item, t, show_info }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [open_resend_modal, set_open_resend_modal] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);
  const [measuredHeight, setMeasuredHeight] = useState(false);
  const animatedHeight = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (measuredHeight) {
      Animated.timing(animatedHeight, {
        toValue: show_info ? contentHeight : 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  }, [show_info, contentHeight, measuredHeight]);

  const handleContentLayout = (event: any) => {
    const { height } = event.nativeEvent.layout;
    if (height !== contentHeight && height > 0) {
      setContentHeight(height);
      setMeasuredHeight(true);
      if (show_info) {
        animatedHeight.setValue(height);
      }
    }
  };
  const handleResendOrder = async () => {
    setIsLoading(true);
    try {
      const res = await Resend_order(item?.id);
      console.log(res?.data);
      Toast.show({
        type: "success",
        text1: t("the_request_was_successfully_resubmitted"),
      });
    } catch (err: any) {
      Toast.show({
        type: "error",
        text1: t(err.response.data?.message),
      });
    } finally {
      setIsLoading(false);
      set_open_resend_modal(false);
    }
  };
  return (
    <View
      style={tw`mb-2 p-2 border rounded-xl ${
        item?.status === "rejected_vendor" ? "border-red-500 bg-red-50" : ""
      }`}
    >
      {isLoading && <Loader />}
      <AccordionSection
        mainChildren={
          <>
            {/* عرض حالة الرفض بتصميم مميز */}
            {item?.status === "rejected_vendor" && (
              <View
                style={tw`mb-3 p-3 bg-red-500 rounded-lg flex-row items-center`}
              >
                <View
                  style={tw`bg-white rounded-full w-8 h-8 items-center justify-center mr-3`}
                >
                  <Text style={tw`text-red-500 font-bold text-lg`}>✕</Text>
                </View>
                <View style={tw`flex-1`}>
                  <Text style={tw`text-white font-bold text-base`}>
                    {t("order_rejected")}
                  </Text>
                  <Text style={tw`text-red-100 text-sm mt-1`}>
                    {t("rejected_by_restaurant")}
                  </Text>
                </View>
              </View>
            )}

            <Text>{item?.vendor?.name}</Text>
            <OrderStatusLine currentStatus={item?.status} />
            <View style={tw`flex-row items-center justify-between`}>
              <Text
                style={tw`${
                  item?.status === "rejected_vendor" ? "text-gray-500" : ""
                }`}
              >
                {item?.payment_method}
              </Text>
              <View style={tw`flex-row items-center`}>
                {item?.status === "rejected_vendor" && (
                  <Text style={tw`text-red-500 mr-2 font-bold`}>❌</Text>
                )}
                <Text
                  style={tw`${
                    item?.status === "rejected_vendor"
                      ? "text-gray-500 line-through"
                      : ""
                  }`}
                >
                  {item?.total_price} {t("l.s")}
                </Text>
              </View>
            </View>
          </>
        }
      >
        {/* Start Meal Info */}
        <View onLayout={handleContentLayout} style={{ position: "relative" }}>
          {item?.details?.map((meal: any) => (
            <View
              style={tw`border-2 border-gray-200 rounded-xl p-1 my-[2px]`}
              key={meal.id}
            >
              <Text>{meal?.meal?.name}</Text>
              {/* Strat quantity */}
              <View style={tw`flex-row items-center gap-2`}>
                <Text>{t("quantity")}:</Text>
                <Text>{meal?.quantity}</Text>
              </View>
              {/* End quantity */}
              {/* Start Details */}
              <View>
                {meal?.details?.map((det: any, inde: number) => (
                  <View key={inde} style={tw`flex-row items-center gap-2`}>
                    <Text>{det?.key} </Text>
                    <Text>{det?.value} </Text>
                  </View>
                ))}
              </View>
              {/* End Details */}
              {/* Strat quantity */}
              <View style={tw`flex-row items-center gap-2`}>
                <Text>{t("total_price")}:</Text>
                <Text>{meal?.total}</Text>
              </View>
              {/* End quantity */}
            </View>
          ))}
        </View>
      </AccordionSection>

      {/* Start Resend Order */}
      {item?.status == "delivered" && (
        <TouchableOpacity
          onPress={() => {
            set_open_resend_modal(true);
          }}
          style={tw`mt-2 border-2 border-[#fc6011] rounded-lg `}
        >
          <Text style={tw`text-[#fc6011] text-center p-3`}>
            {t("resend_order")}
          </Text>
        </TouchableOpacity>
      )}

      {/* عرض خيارات للطلبات المرفوضة */}
      {item?.status === "rejected_vendor" && (
        <View style={tw`mt-3`}>
          <View style={tw`bg-gray-100 p-3 rounded-lg mb-2`}>
            <Text style={tw`text-gray-600 text-center text-sm`}>
              {t("order_was_rejected_message")}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              set_open_resend_modal(true);
            }}
            style={tw`border-2 border-blue-500 rounded-lg bg-blue-50`}
          >
            <Text style={tw`text-blue-500 text-center p-3 font-medium`}>
              {t("reorder_from_restaurant")}
            </Text>
          </TouchableOpacity>
        </View>
      )}
      {/* End Resend ORder */}
      <Modal transparent animationType="fade" visible={open_resend_modal}>
        <TouchableWithoutFeedback onPress={() => set_open_resend_modal(false)}>
          <View style={tw`flex-1 justify-center items-center bg-black/50`}>
            <View style={tw`w-4/5 bg-white rounded-lg p-3 items-center`}>
              <Text style={tw`mb-4 text-center text-black text-base font-bold`}>
                {t("are_you_sure_you_want_repeat_this_order")}
              </Text>
              <View style={tw`flex-row justify-between mt-4`}>
                <TouchableOpacity
                  style={tw`bg-red-500 rounded-lg py-2 px-5 mx-2`}
                  onPress={() => handleResendOrder()}
                >
                  <Text style={tw`text-white`}>{t("confirm")}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={tw`bg-gray-400 rounded-lg py-2 px-5 mx-2`}
                  onPress={() => set_open_resend_modal(false)}
                >
                  <Text style={tw`text-white`}>{t("cancel")}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      {/* End Meal Info */}
    </View>
  );
}

export default MyOrderCard;
