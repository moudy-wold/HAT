import { Add_Address, Ddelte_Address, Maek_as_default } from "@/api/address";
import Loader from "@/components/Global/Loader/Loader";
import TitleAndBackButton from "@/components/Global/TitleAndBackButton/TitleAndBackButton";
import AddressFeils from "@/components/Pages/Address/AddressFeils/AddressFeils";
import ShowAddress from "@/components/Pages/Address/ShowAddress";
import { getAllAddress, getGovernorates } from "@/Helpers/Address";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    Modal,
    RefreshControl,
    ScrollView,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import Toast from "react-native-toast-message";
import tw from "twrnc";

export default function AddressForm() {
  const { t, i18n } = useTranslation();
  const [isLoading, setisLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [governorates, set_governorates] = useState([]);
  const [neighborhoods, set_neighborhoods] = useState<string[]>([]);
  const [citeis_centers, set_citeis_centers] = useState([]);
  const [open_delete_modal, setOpenDeleteModal] = useState(false);
  const [address_data, set_address_data] = useState<any>([]);
  const [update, setUpdate] = useState(false);
  const [selected_id, setSelectedId] = useState("");
  const [selectedAddress, setSelectedAddress] = useState<any>();
  const [form, setForm] = useState({
    governorate: "",
    city: "",
    district: "",
    area_id: "",
    street: "",
    build_no: "",
    floor: "",
    flat: "",
    note: "",
    coordinates: "",
  });

  const handleChange = (key: any, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // set default Address
  const hanelSetDefault = async (id: string) => {
    setisLoading(true);
    try {
      await Maek_as_default(id);
      Toast.show({
        type: "success",
        text1: t("this_address_has_been_set_as_main_address"),
      });
      getAllAddress(setisLoading, set_address_data);
    } catch (err: any) {
      console.error(err);
      Toast.show({
        type: "error",
        text1: err.response.data.message,
      });
    } finally {
      setisLoading(false);
    }
  };

  // Submit
  const handleSubmit = async () => {
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

  // Delete Address
  const onDeleteAddress = async () => {
    setisLoading(true);
    try {
      await Ddelte_Address(selected_id);
      set_address_data((prev: any) =>
        prev.filter((f: any) => f.id !== selected_id)
      );
      getAllAddress(setisLoading, set_address_data);
      setOpenDeleteModal(false);
      Toast.show({ type: "success", text1: t("address_deleted_successfully") });
    } catch (err: any) {
      console.error(err);
    } finally {
      setisLoading(false);
    }
  };

  useEffect(() => {
    getGovernorates(set_governorates);
  }, []);

  useEffect(() => {
    getAllAddress(setisLoading, set_address_data);
  }, [update]);

  const onRefresh = async () => {
    setRefreshing(true);
    getAllAddress(setisLoading, set_address_data);
    setRefreshing(false);
  };
  return (
    <View
      style={[
        tw`p-4 pb-20`,
        { direction: i18n.language == "ar" ? "rtl" : "ltr" },
      ]}
    >
      {isLoading && <Loader />}
      {/* Start Title && Back Button */}
      <TitleAndBackButton title={t("my_address")} />
      {/* End Title && Back Button */}
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#2196f3"]}
          />
        }
      >
        <View>
          {address_data?.map((address: any) => (
            <View key={address?.id}>
              <ShowAddress
                address={address}
                setOpenDeleteModal={setOpenDeleteModal}
                setSelectedId={setSelectedId}
                hanelSetDefault={hanelSetDefault}
                setShowForm={setShowForm}
                setSelectedAddress={setSelectedAddress}
              />
            </View>
          ))}
        </View>

        {/* Start Add New Address */}
        <TouchableOpacity
          onPress={() => setShowForm(!showForm)}
          style={tw`my-4 px-4 py-3 rounded-xl bg-[#fc6011]`}
        >
          <Text style={tw`text-white text-center font-bold`}>
            {t("add_a_new_address")}
          </Text>
        </TouchableOpacity>
        {/* End Add New Address */}

        {/* Start Form Modal */}
        <Modal visible={showForm} animationType="slide">
          <AddressFeils
            handleChange={handleChange}
            set_citeis_centers={set_citeis_centers}
            governorates={governorates}
            set_neighborhoods={set_neighborhoods}
            citeis_centers={citeis_centers}
            neighborhoods={neighborhoods}
            handleSubmit={handleSubmit}
            setShowForm={setShowForm}
            formdata={form}
            selectedAddress={selectedAddress}
          />
        </Modal>
        {/* End Form Modal */}

        {/* Start Delete Address Modal */}
        <Modal transparent visible={open_delete_modal} animationType="fade">
          <TouchableWithoutFeedback onPress={() => setOpenDeleteModal(false)}>
            <View style={tw`flex-1 justify-center items-center bg-[#00000080]`}>
              <TouchableWithoutFeedback onPress={() => {}}>
                <View style={tw`w-3/4 bg-white p-4 rounded-xl mx-auto`}>
                  <Text style={tw`text-lg font-semibold`}>{t("alert")}</Text>
                  <Text style={tw`my-3 text-lg`}>
                    {t("do_you_want_to_delete_this_address")}?
                  </Text>
                  <View
                    style={tw`flex-row items-center justify-between gap-2 mt-5`}
                  >
                    <TouchableOpacity
                      style={tw`border rounded-xl w-1/2 p-2`}
                      onPress={() => setOpenDeleteModal(false)}
                    >
                      <Text style={tw`text-center`}>{t("close")}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={tw`bg-[red] w-1/2 rounded-xl p-2`}
                      onPress={() => {
                        onDeleteAddress();
                      }}
                    >
                      <Text style={tw`text-white text-center`}>
                        {t("confirm")}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
        {/* End Delete Address Modal */}
      </ScrollView>
    </View>
  );
}
