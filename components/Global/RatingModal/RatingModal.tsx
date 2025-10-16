import { Evulation_order } from "@/api/order";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import tw from "twrnc";

type RatingType = "meal" | "vendor" | "driver";

interface RatingItem {
  type: RatingType;
  id: string;
  name?: string;
  icon: React.ReactNode;
  placeholder: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  orderData: {
    order_id: string;
    details?: any;
    meal?: { id: string; name: string };
    vendor?: { id: string; name: string };
    driver?: { id: string; name: string };
  };
}

const RatingModal: React.FC<Props> = ({ isOpen, onClose, orderData }) => {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  console.log(orderData, "orderDataorderData");
  // إعداد عناصر التقييم بناءً على البيانات المتوفرة
  const ratingItems: RatingItem[] = [
    ...(orderData?.vendor
      ? [
          {
            type: "vendor" as RatingType,
            id: orderData?.vendor.id,
            name: orderData?.vendor.name,
            icon: <FontAwesome name="shopping-bag" size={24} color="#fc6011" />,
            placeholder:
              t("vendor_rating_placeholder") || "كيف كانت خدمة المطعم؟",
          },
        ]
      : []),
    ...(orderData?.details
      ? [
          {
            type: "meal" as RatingType,
            id: orderData?.details?.id,
            icon: (
              <MaterialCommunityIcons
                name="silverware-fork-knife"
                size={24}
                color="#fc6011"
              />
            ),
            placeholder: t("meal_rating_placeholder") || "كيف كان طعم الوجبة؟",
          },
        ]
      : []),
    ...(orderData?.driver
      ? [
          {
            type: "driver" as RatingType,
            id: orderData?.driver.id,
            name: orderData?.driver.name,
            icon: <FontAwesome name="truck" size={24} color="#fc6011" />,
            placeholder:
              t("driver_rating_placeholder") || "كيف كانت خدمة التوصيل؟",
          },
        ]
      : []),
  ];

  const [ratings, setRatings] = useState<
    Record<string, { rating: number; comment: string }>
  >({});

  // تحديث التقييم
  const updateRating = (
    type: RatingType,
    rating: number,
    comment: string = ""
  ) => {
    setRatings((prev) => ({
      ...prev,
      [type]: { rating, comment },
    }));
  };

  // إرسال تقييم واحد
  const submitSingleRating = async (item: RatingItem) => {
    const ratingData = ratings[item.type];
    if (!ratingData || ratingData.rating === 0) {
      Toast.show({
        type: "error",
        text1: t("please_select_rating") || "يرجى اختيار التقييم",
      });
      return false;
    }

    try {
      await Evulation_order(
        item.type,
        item.id,
        orderData?.order_id,
        ratingData.rating,
        ratingData.comment || undefined
      );
      return true;
    } catch (error) {
      console.error(`Error rating ${item.type}:`, error);
      Toast.show({
        type: "error",
        text1: t("rating_error") || "حدث خطأ في إرسال التقييم",
      });
      return false;
    }
  };

  // إرسال جميع التقييمات
  const submitAllRatings = async () => {
    setIsSubmitting(true);

    try {
      const promises = ratingItems.map(async (item) => {
        const ratingData = ratings[item.type];
        if (ratingData && ratingData.rating > 0) {
          return submitSingleRating(item);
        }
        return true;
      });

      const results = await Promise.all(promises);
      const allSuccessful = results.every((result) => result);

      if (allSuccessful) {
        Toast.show({
          type: "success",
          text1: t("rating_submitted_successfully") || "تم إرسال التقييم بنجاح",
        });
        onClose();
        setRatings({});
        setCurrentStep(0);
      }
    } catch (error) {
      console.error("Error submitting ratings:", error);
      Toast.show({
        type: "error",
        text1: t("rating_error") || "حدث خطأ في إرسال التقييم",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // التنقل بين الخطوات
  const handleNext = async () => {
    if (currentStep < ratingItems.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      await submitAllRatings();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // مكون النجوم
  const StarRating = ({
    rating,
    onRatingChange,
  }: {
    rating: number;
    onRatingChange: (rating: number) => void;
  }) => {
    return (
      <View style={tw`flex-row justify-center gap-2 my-4`}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => onRatingChange(star)}
            style={tw`p-1`}
          >
            <FontAwesome
              name="star"
              size={32}
              color={star <= rating ? "#fbbf24" : "#d1d5db"}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  if (ratingItems.length === 0) {
    return null;
  }

  const currentItem = ratingItems[currentStep];
  const currentRating = ratings[currentItem.type] || { rating: 0, comment: "" };

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View
        style={tw`flex-1 bg-black bg-opacity-50 justify-center items-center px-4`}
      >
        <View style={tw`bg-white rounded-lg w-full max-w-md p-6`}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View style={tw`flex-row items-center justify-between mb-6`}>
              <View style={tw`flex-row items-center gap-3`}>
                {currentItem.icon}
                <Text style={tw`text-lg font-semibold text-gray-800`}>
                  {t("rate_order") || "تقييم الطلب"}
                </Text>
              </View>
              <TouchableOpacity onPress={onClose} style={tw`p-2`}>
                <Text style={tw`text-gray-500 text-lg font-bold`}>×</Text>
              </TouchableOpacity>
            </View>

            {/* Progress Bar */}
            {ratingItems.length > 1 && (
              <View style={tw`mb-6`}>
                <View style={tw`flex-row justify-between mb-2`}>
                  <Text style={tw`text-sm text-gray-600`}>
                    {currentStep + 1} {t("of") || "من"} {ratingItems.length}
                  </Text>
                  <Text style={tw`text-sm text-gray-600`}>
                    {Math.round(((currentStep + 1) / ratingItems.length) * 100)}
                    %
                  </Text>
                </View>
                <View style={tw`w-full bg-gray-200 rounded-full h-2`}>
                  <View
                    style={[
                      tw`bg-[#fc6011] h-2 rounded-full`,
                      {
                        width: `${
                          ((currentStep + 1) / ratingItems.length) * 100
                        }%`,
                      },
                    ]}
                  />
                </View>
              </View>
            )}

            {/* Rating Content */}
            <View style={tw`items-center`}>
              <View style={tw`mb-4`}>
                <Text
                  style={tw`text-lg font-medium text-gray-800 mb-2 text-center`}
                >
                  {currentItem.type === "meal" &&
                    (t("rate_meal") || "تقييم الوجبة")}
                  {currentItem.type === "vendor" &&
                    (t("rate_restaurant") || "تقييم المطعم")}
                  {currentItem.type === "driver" &&
                    (t("rate_driver") || "تقييم السائق")}
                </Text>
                <Text style={tw`text-gray-600 text-sm text-center`}>
                  {currentItem.name}
                </Text>
              </View>

              {/* Star Rating */}
              <StarRating
                rating={currentRating.rating}
                onRatingChange={(rating) =>
                  updateRating(currentItem.type, rating, currentRating.comment)
                }
              />

              {/* Rating Labels */}
              <View style={tw`flex-row justify-between w-full px-4 mb-6`}>
                <Text style={tw`text-xs text-gray-500`}>
                  {t("very_bad") || "سيء جداً"}
                </Text>
                <Text style={tw`text-xs text-gray-500`}>
                  {t("excellent") || "ممتاز"}
                </Text>
              </View>

              {/* Comment */}
              <View style={tw`mb-6 w-full`}>
                <TextInput
                  value={currentRating.comment}
                  onChangeText={(text) =>
                    updateRating(currentItem.type, currentRating.rating, text)
                  }
                  placeholder={currentItem.placeholder}
                  style={tw`w-full p-3 border border-gray-300 rounded-lg min-h-20`}
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />
              </View>

              {/* Action Buttons */}
              <View style={tw`flex-row gap-3 w-full`}>
                {currentStep > 0 && (
                  <TouchableOpacity
                    onPress={handlePrevious}
                    style={tw`flex-1 py-3 px-4 border border-gray-300 rounded-lg ${
                      isSubmitting ? "opacity-50" : ""
                    }`}
                    disabled={isSubmitting}
                  >
                    <Text style={tw`text-gray-700 text-center font-medium`}>
                      {t("previous") || "السابق"}
                    </Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  onPress={handleNext}
                  disabled={currentRating.rating === 0 || isSubmitting}
                  style={[
                    tw`flex-1 py-3 px-4 rounded-lg`,
                    currentRating.rating === 0 || isSubmitting
                      ? tw`bg-gray-400`
                      : tw`bg-[#fc6011]`,
                  ]}
                >
                  {isSubmitting ? (
                    <View
                      style={tw`flex-row items-center justify-center gap-2`}
                    >
                      <ActivityIndicator size="small" color="white" />
                      <Text style={tw`text-white font-medium`}>
                        {t("submitting") || "جاري الإرسال..."}
                      </Text>
                    </View>
                  ) : (
                    <Text style={tw`text-white text-center font-medium`}>
                      {currentStep === ratingItems.length - 1
                        ? t("submit_rating") || "إرسال التقييم"
                        : t("next") || "التالي"}
                    </Text>
                  )}
                </TouchableOpacity>
              </View>

              {/* Skip Option */}
              {/* {currentRating.rating === 0 && (
                <TouchableOpacity
                  onPress={() => {
                    if (currentStep < ratingItems.length - 1) {
                      setCurrentStep(currentStep + 1);
                    } else {
                      onClose();
                    }
                  }}
                  style={tw`w-full mt-3 py-2`}
                >
                  <Text style={tw`text-gray-500 text-sm text-center`}>
                    {currentStep === ratingItems.length - 1
                      ? t("skip_and_close") || "تخطي والإغلاق"
                      : t("skip_this_step") || "تخطي هذه الخطوة"}
                  </Text>
                </TouchableOpacity>
              )} */}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default RatingModal;
