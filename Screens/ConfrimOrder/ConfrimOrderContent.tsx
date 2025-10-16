import { Add_Address } from "@/api/address";
import { ConfirmOrder } from "@/api/order";
import Loader from "@/components/Global/Loader/Loader";
import TitleAndBackButton from "@/components/Global/TitleAndBackButton/TitleAndBackButton";
import AddressFeils from "@/components/Pages/Address/AddressFeils/AddressFeils";
import ShowAddress from "@/components/Pages/Address/ShowAddress";
import { getAllAddress } from "@/Helpers/Address";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import tw from "twrnc";

function ConfirmeOrderContent() {
  const { t, i18n } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [allAddress, setAllAddress] = useState([]);
  const router = useRouter();
  const [openAddress, setOpenAddress] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [governorates, set_governorates] = useState([]);
  const [neighborhoods, set_neighborhoods] = useState<string[]>([]);
  const [citeis_centers, set_citeis_centers] = useState([]);
  const [update, setUpdate] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<string | null>("cash");
  const [openConfirmOrder, setOpenConfirmOrder] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<any>();
  const [form, setForm] = useState({
    city: "",
    district: "",
    street: "",
    build_no: "",
    floor: "",
    flat: "",
    note: "",
  });

  const handleChange = (key: any, value: any) => {
    setForm({ ...form, [key]: value });
  };

  const handleSelectMethod = (method: string) => {
    setSelectedMethod(method);
  };

  useFocusEffect(
    useCallback(() => {
      getAllAddress(setIsLoading, setAllAddress);

      return () => {};
    }, [])
  );

  useEffect(() => {
    setSelectedAddress(allAddress.find((address: any) => address?.is_default));
  }, [allAddress]);

  // Submit
  const handleAddAddress = async () => {
    setShowForm(false);
    const formdata = new FormData();
    formdata.append("address[city]", form.city);
    formdata.append("address[district]", form.district);
    formdata.append("address[street]", form.street);
    formdata.append("address[build_no]", form.build_no);
    formdata.append("address[floor]", form.floor);
    formdata.append("address[flat]", form.flat);
    formdata.append("address[note]", form.note);
    try {
      await Add_Address(formdata);
      Toast.show({
        type: "success",
        text1: t("address_added_successfully"),
      });
      setShowForm(false);
      setUpdate(!update);
    } catch (err: any) {
      console.error(err);
      Toast.show({
        type: "error",
        text1: err.response.data.message,
      });
    }
  };

  const handleConfirmeOrder = async () => {
    setIsLoading(true);
    try {
      await ConfirmOrder(selectedAddress.id, "cash_on_delivery");
      Toast.show({
        type: "success",
        text1: t("order_has_been_confirmed"),
      });
      setOpenConfirmOrder(false);
      setTimeout(() => {
        router.push("/(tabs)");
      }, 200);
    } catch (err: any) {
      console.error(err);
      Toast.show({
        type: "error",
        text1: err.response.data.message,
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <ScrollView
      style={[
        tw`p-4 bg-gray-50  min-h-full`,
        { direction: i18n.language == "ar" ? "rtl" : "ltr" },
      ]}
    >
      {isLoading && <Loader />}
      {/* Start Title && Back Button */}
      <TitleAndBackButton title={t("confirme_order")} />
      {/* End Title && Back Button */}

      {/* Start Default Address */}
      <View
        style={tw`bg-white rounded-xl p-4 mb-4 shadow-sm border border-gray-100`}
      >
        <View style={tw`flex-row items-center mb-3`}>
          <View style={tw`w-2 h-6 bg-[#fc6011] rounded mr-2`} />
          <Text style={tw`text-lg font-semibold text-gray-800`}>
            📍 {t("delivery_address")}
          </Text>
        </View>
        {allAddress.find((item: any) => item.is_default == 1) ? (
          <>
            <View style={tw`mb-3`}>
              <ShowAddress
                address={allAddress.find((item: any) => item.is_default == 1)}
              />
            </View>
            {/* Start Add Address Button  */}
            <TouchableOpacity
              onPress={() => {
                setOpenAddress(true);
              }}
              style={tw`border-2 border-[#fc6011] rounded-xl py-3 px-4 bg-orange-50`}
            >
              <View style={tw`flex-row items-center justify-center`}>
                <Text style={tw`text-[#fc6011] font-medium mr-2`}>🔄</Text>
                <Text style={tw`text-[#fc6011] font-medium`}>
                  {t("selecte_another_address")}
                </Text>
              </View>
            </TouchableOpacity>
            {/* End Add Address Button  */}
          </>
        ) : (
          <TouchableOpacity
            onPress={() => {
              router.push("/(Pages)/myaddress");
            }}
            style={tw`bg-[#fc6011] rounded-xl py-4 px-4 shadow-md`}
          >
            <View style={tw`flex-row items-center justify-center`}>
              <Text style={tw`text-white font-medium mr-2 text-lg`}>➕</Text>
              <Text style={tw`text-white font-semibold text-base`}>
                {t("add_new_address")}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      </View>

      {/* End Default Address */}
      {/* Start Selecte Payment Method */}
      <View
        style={tw`bg-white rounded-xl p-4 mb-4 shadow-sm border border-gray-100`}
      >
        <View style={tw`flex-row items-center mb-4`}>
          <View style={tw`w-2 h-6 bg-[#fc6011] rounded mr-2`} />
          <Text style={tw`text-lg font-semibold text-gray-800`}>
            💳 {t("choose_paymeny_method")}
          </Text>
        </View>

        <View style={tw`space-y-4`}>
          <TouchableOpacity
            onPress={() => handleSelectMethod("cash")}
            style={tw.style(
              `w-full border-2 rounded-xl p-4 relative`,
              selectedMethod === "cash"
                ? "border-[#fc6011] bg-orange-50 shadow-sm"
                : "border-gray-200 bg-white"
            )}
          >
            <View style={tw`flex-row items-start`}>
              <View style={tw`mr-3 mt-1`}>
                <View
                  style={tw.style(
                    `w-5 h-5 rounded-full border-2 items-center justify-center`,
                    selectedMethod === "cash"
                      ? "border-[#fc6011] bg-[#fc6011]"
                      : "border-gray-300"
                  )}
                >
                  {selectedMethod === "cash" && (
                    <Text style={tw`text-white text-xs`}>✓</Text>
                  )}
                </View>
              </View>
              <View style={tw`flex-1`}>
                <View style={tw`flex-row items-center mb-1`}>
                  <Text style={tw`text-lg mr-2`}>💵</Text>
                  <Text
                    style={tw`text-base font-bold ${
                      selectedMethod === "cash"
                        ? "text-[#fc6011]"
                        : "text-gray-800"
                    }`}
                  >
                    {t("cash_on_delivery")}
                  </Text>
                </View>
                <Text
                  style={tw`text-sm ${
                    selectedMethod === "cash"
                      ? "text-[#fc6011]"
                      : "text-gray-600"
                  }`}
                >
                  {t("pay_when_receiving_the_order_from_the_delivery_person")}
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* Start online Pay */}
          <TouchableOpacity
            disabled={true}
            onPress={() => handleSelectMethod("online")}
            style={tw.style(
              `w-full border-2 mt-2 rounded-xl p-4 py-3 relative opacity-60`,
              selectedMethod === "online"
                ? "border-[#fc6011] bg-orange-50 shadow-sm"
                : "border-gray-200 bg-gray-50"
            )}
          >
            <View style={tw`flex-row items-start`}>
              <View style={tw`mr-3 mt-1`}>
                <View
                  style={tw.style(
                    `w-5 h-5 rounded-full border-2 items-center justify-center`,
                    selectedMethod === "online"
                      ? "border-[#fc6011] bg-[#fc6011]"
                      : "border-gray-300"
                  )}
                >
                  {selectedMethod === "online" && (
                    <Text style={tw`text-white text-xs`}>✓</Text>
                  )}
                </View>
              </View>
              <View style={tw`flex-1`}>
                <View style={tw`flex-row items-center mb-1`}>
                  <Text style={tw`text-lg mr-2`}>💳</Text>
                  <Text style={tw`text-base font-bold text-gray-500`}>
                    {t("pay_online")}
                  </Text>
                  <View style={tw`ml-2 bg-gray-400 px-2 py-1 rounded-full`}>
                    <Text style={tw`text-xs text-white font-medium`}>
                      قريباً
                    </Text>
                  </View>
                </View>
                <Text style={tw`text-sm text-gray-500`}>
                  {t("use_your_card_or_electronic_payment_methods")}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
          {/* End online Pay */}
        </View>
      </View>

      {/* زر تأكيد الطلب */}
      <View style={tw` `}>
        <TouchableOpacity
          onPress={() => {
            if (!selectedAddress?.id) {
              Toast.show({
                type: "error",
                text1: t("please_select_address"),
              });
              return;
            }
            setOpenConfirmOrder(true);
          }}
          style={tw`bg-[#fc6011] rounded-xl py-3 px-6 shadow-lg border border-orange-600 mb-10`}
        >
          <View style={tw`flex-row items-center justify-center`}>
            <Text style={tw`text-white text-lg font-semibold mx-2`}>✅</Text>
            <Text style={tw`text-white text-lg font-semibold`}>
              {t("confirme_order")}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
      {/* End Selecte Payment Method */}

      {/* Start Add New Address */}
      <Modal
        transparent
        visible={openAddress}
        animationType="slide"
        onRequestClose={() => setOpenAddress(false)}
      >
        <View style={tw`flex-1 bg-black/50 justify-end`}>
          <View style={tw`bg-white rounded-t-3xl max-h-[80%]`}>
            <View style={tw`p-4 border-b border-gray-100`}>
              <View
                style={tw`w-12 h-1 bg-gray-300 rounded-full self-center mb-4`}
              />
              <View style={tw`flex-row items-center justify-between`}>
                <Text style={tw`text-xl font-semibold text-gray-800`}>
                  📍 {t("choose_address")}
                </Text>
                <TouchableOpacity
                  onPress={() => setOpenAddress(false)}
                  style={tw`w-8 h-8 bg-gray-100 rounded-full items-center justify-center`}
                >
                  <Text style={tw`text-gray-600 font-bold`}>✕</Text>
                </TouchableOpacity>
              </View>
            </View>
            <ScrollView style={tw`p-4`}>
              {allAddress?.map((address: any) => (
                <View
                  key={address?.id}
                  style={tw`mb-3 p-3 border border-gray-100 rounded-xl`}
                >
                  <ShowAddress address={address} />
                </View>
              ))}
              <TouchableOpacity
                onPress={() => {
                  router.push("/(Pages)/myaddress");
                }}
                style={tw`bg-[#fc6011] rounded-xl py-3 px-4 mb-10 shadow-md`}
              >
                <View style={tw`flex-row items-center justify-center`}>
                  <Text style={tw`text-white font-medium mr-2 text-lg`}>
                    ➕
                  </Text>
                  <Text style={tw`text-white font-semibold`}>
                    {t("add_new_address")}
                  </Text>
                </View>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
      {/* End Add New Address */}

      {/* Start Show Form Modal */}
      <Modal visible={showForm} animationType="slide">
        <AddressFeils
          handleChange={handleChange}
          set_citeis_centers={set_citeis_centers}
          governorates={governorates}
          set_neighborhoods={set_neighborhoods}
          citeis_centers={citeis_centers}
          neighborhoods={neighborhoods}
          handleSubmit={handleAddAddress}
          setShowForm={setShowForm}
          formdata={form}
        />
      </Modal>
      {/* End Show Form Modal */}

      {/* Start Confirme Question */}
      <Modal
        visible={openConfirmOrder}
        transparent
        animationType="fade"
        onRequestClose={() => setOpenConfirmOrder(false)}
      >
        <TouchableWithoutFeedback onPress={() => setOpenConfirmOrder(false)}>
          <View style={tw`flex-1 bg-black/60 justify-center items-center p-4`}>
            <View
              style={tw`bg-white p-6 rounded-2xl w-full max-w-sm shadow-2xl`}
            >
              <View style={tw`items-center mb-4`}>
                <View
                  style={tw`w-16 h-16 bg-orange-100 rounded-full items-center justify-center mb-4`}
                >
                  <Text style={tw`text-2xl`}>🛒</Text>
                </View>
                <Text
                  style={tw`text-xl font-semibold text-gray-800 text-center mb-2`}
                >
                  تأكيد الطلب
                </Text>
                <Text style={tw`text-gray-600 text-center leading-5`}>
                  {t("Will_the_order_be_confirmed")}
                </Text>
              </View>

              <View style={tw`flex-row gap-3 mt-6`}>
                <TouchableOpacity
                  style={tw`flex-1 bg-[#fc6011] py-3 px-4 rounded-xl shadow-sm`}
                  onPress={() => {
                    handleConfirmeOrder();
                    setOpenConfirmOrder(false);
                    setOpenAddress(false);
                  }}
                >
                  <Text
                    style={tw`text-center text-white font-semibold text-base`}
                  >
                    ✅ {t("confirme")}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={tw`flex-1 border-2 border-gray-200 py-3 px-4 rounded-xl bg-gray-50`}
                  onPress={() => setOpenConfirmOrder(false)}
                >
                  <Text
                    style={tw`text-center text-gray-700 font-medium text-base`}
                  >
                    {t("cancel")}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      {/* End Confirme Question */}
    </ScrollView>
  );
}

export default ConfirmeOrderContent;
