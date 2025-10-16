import { AntDesign } from "@expo/vector-icons";
import React from "react";
import { useTranslation } from "react-i18next";
import { Text, TouchableOpacity, View } from "react-native";
import tw from "twrnc";
function ShowAddress({
  address,
  selectedAddress,
  setSelectedId,
  hanelSetDefault,
  setShowForm,
  setSelectedAddress,
  setOpenDeleteModal,
}: any) {
  const { t, i18n } = useTranslation();
  return (
    <View
      key={address?.id}
      style={tw`mb-4 p-4 pt-2 rounded-xl ${
        address?.is_default == 1
          ? "border-2 border-[#fc6011]"
          : " border border-gray-300"
      } relative`}
    >
      {address?.is_default == 1 && (
        <View style={``}>
          <Text style={tw`text-lg font-semibold`}>
            {t("default_address")}:{" "}
          </Text>
        </View>
      )}
      {/* Start Delete Icon */}
      {/* {selectedAddress && ( */}
      <TouchableOpacity
        onPress={() => {
          // selectedAddress(true);
          setOpenDeleteModal(true);
          setSelectedId(address?.id);
        }}
        style={tw`absolute top-3 ${
          i18n?.language == "ar" ? "left-2" : "right-2"
        } z-10 `}
      >
        <AntDesign name="delete" size={24} color="#fc6011" />{" "}
      </TouchableOpacity>
      {/* )} */}
      {/* End Delete Icon */}
      {/* Start Full ADdress */}
      <Text style={tw`text-sm text-black dark:text-white`}>
        <Text style={tw``}>{t("the_city")}:</Text> {address?.governorate}
        {"\n"}
        <Text style={tw``}>{t("the_neighborhood")}:</Text> {address?.area_id}
        {"\n"}
        <Text style={tw``}>{t("the_street")}:</Text> {address?.street}
        {"\n"}
        <Text style={tw``}>{t("the_build_no")}:</Text> {address?.build_no}
        {"\n"}
        <Text style={tw``}>{t("the_floor")}:</Text> {address?.floor}
        {"\n"}
        <Text style={tw``}>{t("flat_no")}:</Text> {address?.flat}
        {"\n"}
        <Text style={tw``}>{t("note")}:</Text> {address?.note}
      </Text>
      {/* End Full ADdress */}
      {/* Start Set As Default Address */}
      {address?.is_default == 0 && (
        <TouchableOpacity
          onPress={() => {
            hanelSetDefault(address?.id);
          }}
          style={tw`bg-white border-[#fc6011] border-[1px] mt-3 rounded-lg `}
        >
          <Text style={tw`text-[#fc6011] text-center p-2`}>
            {t("make_this_address_as_default")}
          </Text>
        </TouchableOpacity>
      )}
      {/* End Set As Default Address */}

      {/* Start Edit Icon */}
      {/* <TouchableOpacity
        onPress={() => {
          console.log(address);
          setSelectedAddress(address);
          setShowForm(true);
        }}
        style={tw`absolute bottom-2 ${
          i18n?.language == "ar" ? "left-2" : "right-2"
        }   z-10`}
      >
        <AntDesign name="edit" size={24} color="black" />{" "}
      </TouchableOpacity> */}
      {/* End Edit Icon */}
    </View>
  );
}

export default ShowAddress;
