import { Add_To_Cart } from "@/api/cart";
import { Add_Remove_Item } from "@/api/wishlist";
import GlobalRating from "@/components/Global/GlobalRating/GlobalRating";
import useStore from "@/store/useStore";
import { MaterialIcons } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import Svg, { Path } from "react-native-svg";
import Toast from "react-native-toast-message";
import tw from "twrnc";
import Loader from "../../components/Global/Loader/Loader";
import QuestionsSection from "./QuestionsSection";

function MealContent({ data }: any) {
  const { t } = useTranslation();
  const [isLoadingInc, setIsLoadingInc] = useState(false);
  const [isLoadingDec, setIsLoadingDec] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedValues, setSelectedValues] = useState([]);
  const [quntitFromData, setQuantityFromData] = useState(1);
  const [openIndexes, setOpenIndexes] = useState<number[]>([]);
  const { wishList_ids, set_wishList_ids } = useStore();
  const isFavorite = wishList_ids.includes(data?.id);
  const { set_cart_length } = useStore();
  const [requiredFeilds, setRequiredFeilds] = useState<any>([]);

  const toggleOptions = (index: number) => {
    setOpenIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };
  const router = useRouter();

  const handleChange = (event: any) => {
    const { value, checked, name, type, price, discount_price } = event.target;

    setSelectedValues((prev: any) => {
      console.log("Previous selectedValues:", prev);
      const existingIndex = prev.findIndex((item: any) => item.key === name);

      // إذا كان الاختيار متعدد (checkbox)
      if (type === "checkbox") {
        let values =
          existingIndex !== -1 ? prev[existingIndex].value.split(",") : [];

        if (checked) {
          values.push(value);
        } else {
          values = values.filter((v: any) => v !== value);
        }

        if (values.length === 0) {
          // احذف العنصر إذا لم يتبقّ شيء للحقول غير المطلوبة فقط
          const isRequired =
            data?.details?.find((item: any) => item.name === name)?.required ===
            "1";

          if (isRequired) {
            // للحقول المطلوبة، احتفظ بالعنصر مع قيمة فارغة
            const updatedItem = {
              key: name,
              value: "",
              price: price,
              discount_price: discount_price,
            };

            if (existingIndex !== -1) {
              return prev.map((item: any, index: any) =>
                index === existingIndex ? updatedItem : item
              );
            } else {
              return [...prev, updatedItem];
            }
          } else {
            // للحقول غير المطلوبة، احذف العنصر
            return prev.filter((item: any) => item.key !== name);
          }
        }

        const updatedItem = {
          key: name,
          value: values.join(","),
          price: price,
          discount_price: discount_price,
        };

        if (existingIndex !== -1) {
          return prev.map((item: any, index: any) =>
            index === existingIndex ? updatedItem : item
          );
        } else {
          return [...prev, updatedItem];
        }
      }

      // إذا كان Radio (اختيار واحد)
      const updatedItem = { key: name, value };

      const newState =
        existingIndex !== -1
          ? prev.map((item: any, index: any) =>
              index === existingIndex ? updatedItem : item
            )
          : [...prev, updatedItem];

      return newState;
    });
  };

  const handleIncrease = async (currentNum: number) => {
    setIsLoadingInc(true);
    setQuantityFromData((prev: number) => prev + 1);
    setIsLoadingInc(false);
  };

  const handleDecrease = async (currentNum: number) => {
    if (quntitFromData > 1) {
      setIsLoadingDec(true);
      setQuantityFromData((prev: number) => prev - 1);
    }
    setIsLoadingDec(false);
  };
  const validateRequiredFields = () => {
    // الحصول على أسماء الحقول المطلوبة فقط
    const requiredKeys =
      data?.details
        ?.filter((item: any) => item.required === "1")
        .map((item: any) => item.name) || [];

    // الحصول على أسماء الحقول المعبأة فقط (مع قيم غير فارغة)
    const filledKeys = selectedValues
      .filter((item: any) => item.value && item.value.trim() !== "")
      .map((item: any) => item.key);

    // التحقق من الحقول المفقودة
    const missingFields = requiredKeys.filter(
      (key: string) => !filledKeys.includes(key)
    );

    setRequiredFeilds(missingFields);

    return missingFields.length === 0;
  };

  // Handle Add To card
  const handleAddToCard = async (id: string) => {
    const isValid = validateRequiredFields();

    if (!isValid) {
      Toast.show({
        type: "error",
        text1: t("please_select_all_required_feilds"),
      });
      return;
    }
    setIsLoading(true);
    const datas = {
      itemable_id: id,
      quantity: quntitFromData,
      details: selectedValues,
    };
    try {
      await Add_To_Cart(datas);
      const numStr = await AsyncStorage.getItem("cart_length");
      const num = parseInt(numStr ?? "0", 10);
      const newVal = (num + 1).toString();

      await AsyncStorage.setItem("cart_length", newVal);
      set_cart_length(num + 1);

      Toast.show({
        type: "success",
        text1: t("added_meal_to_cart_successfuly"),
      });
    } catch (err: any) {
      console.error(err);
      Toast.show({
        type: "error",
        text1: err?.response?.data?.message || "Unknown error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddOrDeleteTowishList = async (meal_id: string) => {
    setIsLoading(true);
    try {
      const res = await Add_Remove_Item(meal_id, "meal");
      if (res?.data?.data?.length) {
        Toast.show({
          type: "success",
          text1: t("meal_has_been_added_to_favourites"),
        });
      } else {
        Toast.show({
          type: "success",
          text1: t("item_has_been_removed_from_favourites"),
        });
      }

      let updatedwishlists = [...wishList_ids];
      if (updatedwishlists.includes(meal_id)) {
        updatedwishlists = updatedwishlists.filter((id) => id !== meal_id);
      } else {
        updatedwishlists.push(meal_id);
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

  const getSelectedFor = (name: string) => {
    const item: any = selectedValues.find((v: any) => v.key === name);
    return item?.value || "";
  };

  return (
    <ScrollView style={tw`   mb-10`}>
      {isLoading && <Loader />}

      <View style={tw``}>
        <Image
          source={{ uri: data?.images[0] }}
          style={tw`w-[100%] h-[200px] rounded-lg self-center`}
        />
      </View>

      <View style={tw`relative px-4 -mt-5 pt-5 bg-white rounded-t-8 `}>
        {/* Start Wishlist */}
        <View
          style={[
            tw`absolute -top-10 right-5`,
            {
              transform: [{ rotate: "90deg" }],
            },
          ]}
        >
          <View style={tw`w-20 h-20 relative`}>
            <Svg width={80} height={80} viewBox="0 0 100 100">
              <Path
                d="M50 5
             Q85 60, 80 75
             Q50 95, 10 75
             Q15 30, 50 5
             Z"
                fill="white"
                stroke="#ddd"
                strokeWidth={2}
              />
            </Svg>
            <TouchableOpacity
              style={[
                tw`absolute top-7 left-6 items-center justify-center`,
                {
                  transform: [{ rotate: "-90deg" }],
                },
              ]}
              onPress={() => {
                handleAddOrDeleteTowishList(data?.id);
              }}
            >
              <MaterialIcons
                name="favorite-border"
                size={24}
                color={isFavorite ? "#fc6011" : "black"}
              />
            </TouchableOpacity>
          </View>
        </View>
        {/* End Wishlist */}

        {/* Start Name */}
        <Text style={tw`font-semibold text-xl text-black`}>{data?.name}</Text>
        {/* End Name */}

        {/* Start Rating */}
        <View style={tw`  flex-row items-center`}>
          <GlobalRating average_rating={data?.rating_average} />
          <Text style={tw`text-sm text-gray-700`}>{data?.rating_average}</Text>
          <Text style={tw`text-sm text-gray-500 ml-1`}>
            ({data?.rating_count > 0 ? `${data?.rating_count} 0` : 0})
          </Text>
        </View>
        {/* End Rating */}

        {/* Start Vendor & Price */}
        <View style={tw`flex flex-row justify-between my-2`}>
          {/* Start Vendor Name */}
          <TouchableOpacity
            onPress={() => router.push(`/resturant/${data?.vendor?.id}`)}
          >
            <Text style={tw`text-[#fc6011] text-base font-semibold mb-4`}>
              {data?.vendor?.details?.restaurant_name}
            </Text>
          </TouchableOpacity>
          {/* End  Vendor Name */}

          {/* Start Price */}
          <View style={tw`flex flex-row items-center mt-3 mx-2`}>
            <Text style={tw`font-semibold text- mt-2 mx-1`}>{t("l.s")}</Text>
            <Text style={tw`font-semibold text-3xl`}>{data?.price} </Text>
          </View>
        </View>
        {/* End Price & Vendor */}

        {/* Start Ingredients */}
        <View>
          <Text style={tw`text-gray-700`}>{data?.ingredients}</Text>
        </View>
        {/* End Ingredients */}

        {/* Start Recommended Options */}
        <View>
          <Text style={tw`font-semibold text-base mt-5 mb-3`}>
            {t("recommended_options")}
          </Text>
          <View style={tw`gap-4`}>
            {data?.details?.map((det: any, ind: number) => {
              const isOpen = openIndexes.includes(ind);
              return (
                <View key={ind}>
                  <TouchableOpacity
                    onPress={() => {
                      setRequiredFeilds((prev: string[]) =>
                        prev.filter((item) => item !== det.name)
                      );
                      toggleOptions(ind);
                    }}
                    style={tw`${
                      requiredFeilds.includes(det?.name) &&
                      "border-2 border-[red] rounded-lg "
                    } flex-row justify-between items-center p-[2px]`}
                  >
                    <View style={tw`flex flex-row items-center gap-2  `}>
                      <Text style={tw`font-semibold text-black text-xl`}>
                        {det?.name}
                      </Text>
                      {/* Start Required & Multi Select Labels */}
                      {det.required == "1" && (
                        <View style={tw`flex-row items-center mt-1`}>
                          <Image
                            source={require("../../assets/images/required.png")}
                            style={tw`w-4 h-4 mr-1`}
                          />
                          <Text style={tw`text-[#00872f] text-sm`}>
                            {t("required")}
                          </Text>
                          {det?.multi_select == "1" && (
                            <Text style={tw`text-xs text-gray-600 ml-2`}>
                              {t("multi_select")}
                            </Text>
                          )}
                        </View>
                      )}
                      {/* End Required & Multi Select Labels */}
                    </View>
                    <AntDesign
                      name="arrow-down"
                      size={24}
                      color="black"
                      style={[
                        {
                          transform: [{ rotate: isOpen ? "180deg" : "0deg" }],
                        },
                      ]}
                    />
                  </TouchableOpacity>

                  {/* Start  Options */}
                  {isOpen &&
                    det?.options.map((option: any) => {
                      const isSelected = det.multi_select
                        ? getSelectedFor(det.name)
                            .split(",")
                            .includes(option?.value)
                        : getSelectedFor(det.name) === option?.value;

                      return (
                        <TouchableOpacity
                          key={option?.value}
                          onPress={() => {
                            setRequiredFeilds((prev: string[]) =>
                              prev.filter((item) => item !== det.name)
                            );
                            handleChange({
                              target: {
                                name: det.name,
                                value: option?.value,
                                type:
                                  det.multi_select == "1"
                                    ? "checkbox"
                                    : "radio",
                                checked: !isSelected,
                                price: option?.price,
                                discount_price: option?.discount_price,
                              },
                            });
                          }}
                          style={tw`flex-row items-center border-b border-gray-300 py-2`}
                        >
                          <View
                            style={tw`w-4 h-4 rounded-full border mr-2 ${
                              isSelected
                                ? "bg-[#fc6011] border-[#fc6011]"
                                : "border-gray-400"
                            }`}
                          />
                          <Text style={tw`text-black`}>{option?.value}</Text>

                          <Text
                            style={tw`ml-2 ${
                              option?.discount_price < option?.price
                                ? "line-through text-xs text-gray-500"
                                : "text-[#fc6011]"
                            }`}
                          >
                            {option?.price}
                          </Text>

                          {option?.discount_price < option?.price && (
                            <Text style={tw`ml-2 text-[#fc6011]`}>
                              {option?.discount_price}
                            </Text>
                          )}
                        </TouchableOpacity>
                      );
                    })}
                  {/* End  Options */}
                </View>
              );
            })}
          </View>
        </View>
        {/* End Recommended Options */}

        {/* Add to Cart */}
        {/* Start Increase / Decrease Buttons */}
        <View style={tw`flex-row items-center justify-around mt-8`}>
          <View style={tw`w-1/2`}>
            <Text style={tw`text-center  `}>{t("number_of_product")}</Text>
          </View>
          <TouchableOpacity
            onPress={() => handleIncrease(quntitFromData)}
            style={tw`px-[14px] py-[6px] rounded-full border border-[#fc6011] ${
              isLoadingInc ? "bg-white" : "bg-[#fc6011]"
            }`}
          >
            <Text style={tw`text-white text-xl`}>
              {isLoadingInc ? "..." : "+"}
            </Text>
          </TouchableOpacity>

          <Text style={tw`text-lg text-gray-800`}>{quntitFromData}</Text>

          <TouchableOpacity
            onPress={() => handleDecrease(quntitFromData)}
            style={tw`px-[17px] py-[7px] rounded-full border border-[#fc6011] ${
              isLoadingDec ? "bg-white" : "bg-[#fc6011]"
            }`}
          >
            <Text style={tw`text-white text-xl`}>
              {isLoadingDec ? "..." : "-"}
            </Text>
          </TouchableOpacity>
        </View>
        {/* End Increase / Decrease Buttons */}

        <View style={tw` relative py-6 mb-5`}>
          <View
            style={tw`absolute top-1 -left-20 bg-[#fc6011] w-1/2 h-44 rounded-r-6`}
          />
          <View
            style={tw`bg-white w-full p-4 shadow-lg rounded-l-3xl w-5/6 ml-7 flex flex-col gap-2`}
          >
            <Text style={tw`text-center`}>{t("total_price")}:</Text>
            <Text style={tw`font-semibold text-lg text-center`}>
              {t("l.s")} {data?.price * quntitFromData}
            </Text>
            <TouchableOpacity
              onPress={() => handleAddToCard(data?.id)}
              style={tw`bg-[#fc6011] rounded-full py-2 w-full items-center flex flex-row items-center gap-1 justify-center`}
            >
              <AntDesign name="shopping-cart" size={18} color="#fff" />
              <Text style={tw`text-white font-semibold `}>
                {t("add_to_cart")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                router.push(`/(Pages)/cart`);
              }}
              style={tw`absolute top-1/2 -right-5 shadow-2xl rounded-full p-2  bg-white`}
            >
              <AntDesign name="shopping-cart" size={24} color="#fc6011" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <QuestionsSection mealId={data?.id} />
    </ScrollView>
  );
}

export default MealContent;
