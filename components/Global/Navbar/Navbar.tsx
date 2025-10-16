import { Edit_zones, Get_zones } from "@/api/address";
import { Get_info } from "@/api/info";
import useStore from "@/store/useStore";
import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal, Text, TouchableOpacity, View } from "react-native";
import tw from "twrnc";
import GlobalNotifications from "../GlobalNotifications/GlobalNotifications";
import Loader from "../Loader/Loader";
import RatingModal from "../RatingModal/RatingModal";
import CustomPicker from "../SelectSericeZone/SelectServiceZone";
function Navbar() {
  const { t, i18n } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [governorates, set_governorates] = useState([]);
  const [serviceZone, setServiceZone] = useState("1");
  const router = useRouter();
  const [showPicker, setShowPicker] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [unComplitedOrder, setUnComplitedOrder] = useState<any>(null);

  const {
    refreshCart,
    cart_length,
    set_cart_length,
    set_wishList_length,
    set_wishList_ids,
    setRefreshHomeScreenData,
    ratingModal,
    setRatingModal,
  } = useStore();

  const handleChangeZone = async (value: { id: string; name: string }) => {
    setIsLoading(true);
    try {
      await Edit_zones(value?.id);
      setSelected(value?.name);
      setShowPicker(false);
      setRefreshHomeScreenData();
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  // Fetch Governorates In First
  const getGovernorates = async () => {
    try {
      const res = await Get_zones();
      set_governorates(res?.data?.data);
    } catch (err: any) {
      console.error(err);
    }
  };

  const getCartLength = async () => {
    try {
      const res = await Get_info();
      set_wishList_length(res?.data?.data?.wishlists?.length);
      set_cart_length(res?.data?.data?.cart_length);
      setServiceZone(res?.data?.data?.service_zone || null);
      setSelected(res?.data?.data?.service_zone);
      const newIds = res?.data?.data?.wishlists.map(
        (item: any) => item?.item?.id
      );
      set_wishList_ids(newIds);
    } catch (err: any) {
      console.error(err);
      if (
        err.response.data.message ==
        "You must complete your order review before proceeding."
      ) {
        setUnComplitedOrder(err?.response?.data?.data[0] || null);
      }
    }
  };

  useEffect(() => {
    getCartLength();
  }, [refreshCart]);

  useEffect(() => {
    getGovernorates();
  }, []);

  useEffect(() => {
    if (!serviceZone) {
      setShowPicker(true);
    }
  }, [serviceZone]);

  return (
    <View
      style={tw`bg-white flex flex-row items-center border-b-2 border-gray-200 px-4`}
    >
      <GlobalNotifications t={t} />
      {isLoading && <Loader />}
      {/* Start Service Zone */}
      <View style={tw` w-3/4 pt-3 pb-2 `}>
        <TouchableOpacity
          style={tw` p-2 rounded`}
          onPress={() => setShowPicker(true)}
        >
          <Text
            style={tw`text-center   ${
              i18n.language === "ar" ? "-mr-20" : "ml-22"
            }`}
          >
            {selected ? selected : t("choose_the_city")}
          </Text>
        </TouchableOpacity>
      </View>
      {/* End Service Zone */}
      {/* Start Cart Icon */}
      <View style={tw`flex flex-row items-center justify-end w-full w-1/4`}>
        <TouchableOpacity
          onPress={() => {
            router.push("/(Pages)/cart");
          }}
          style={{ position: "relative" }}
        >
          <AntDesign name="shopping-cart" size={24} color="black" />
          <View
            style={tw`absolute -top-2 -right-2 bg-red-500 rounded-full w-5 h-5 items-center justify-center`}
          >
            <Text style={tw`text-white text-xs`}>{cart_length}</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Start Choose Zone Modal */}
      <CustomPicker
        data={governorates}
        isOpen={showPicker}
        onClose={() => setShowPicker(selected ? false : true)}
        handleChangeZone={handleChangeZone}
      />
      {/* End Choose Zone Modal */}
      {/* End Cart Icon */}

      {/* Start Rating Modal */}
      <Modal transparent visible={ratingModal} animationType="fade">
        <RatingModal
          isOpen={ratingModal}
          onClose={() => setRatingModal(false)}
          orderData={unComplitedOrder}
        />
      </Modal>
      {/* End Rating Modal */}
    </View>
  );
}

export default Navbar;
