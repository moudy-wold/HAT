import { Get_all_tickets } from "@/api/ticket";
import Loader from "@/components/Global/Loader/Loader";
import SupportCard from "@/components/Pages/Support/SupportCard";
import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Button,
  Image,
  Modal,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import tw from "twrnc";

function SupportContent() {
  const { t, i18n } = useTranslation();
  const [totalItems, setTotalItems] = useState(0);
  const [data, setData] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [openFile, setOpenFile] = useState(false);
  const [file, setFile] = useState("");
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);

  const handlePagination = async () => {
    setIsLoading(true);
    try {
      const nextPage = page + 1;
      const res = await Get_all_tickets(nextPage);
      setData((prev: any) => [...prev, res.data.data]);
      setIsLoading(false);
      setPage(nextPage);
    } catch (err: any) {
      Toast.show({
        type: "error",
        text1: err.response.data.message,
      });
      setIsLoading(false);
    }
  };

  const getData = async () => {
    setIsLoading(true);
    try {
      const res = await Get_all_tickets(page);
      setTotalItems(res.data.pagination.total);
      setData(res.data.data);
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  // First Fetch
  useEffect(() => {
    // setData(ticketMessage);
    // console.log(ticketMessage, "asd")
    getData();
  }, []);
  const onRefresh = async () => {
    setRefreshing(true);
    await getData();
    setRefreshing(false);
  };
  return (
    <ScrollView
      style={tw`p-4 mb-5`}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={["#2196f3"]}
        />
      }
    >
      <View style={tw`absolute`}>
        <Loader isVisible={isLoading} isLoading={isLoading} />
      </View>

      {isLoading && <Loader />}
      <View className="mt-5 mb-8 px-4">
        <View style={tw`p-2`}>
          <TouchableOpacity
            onPress={() => {
              router.replace("/(Pages)/support/create");
            }}
            style={tw` ${
              i18n.language == "ar" ? "w-32" : "w-44"
            } border-2 border-[#fc6011] rounded-lg flex flex-row items-center justify-center mx-auto text-sm p-2  `}
          >
            <Text style={tw`mx-1 text-center text-[#fc6011]`}>
              {t("create_new_support")}
            </Text>
            <AntDesign name="plus-circle" size={24} color="#fc6011" />
          </TouchableOpacity>
        </View>
      </View>
      {/* Start Ticket List */}
      <View>
        <View style={tw`p-2`}>
          {data.map((item: any, index: number) => {
            return (
              <View key={index}>
                <SupportCard
                  item={item}
                  setOpenFile={setOpenFile}
                  setFile={setFile}
                />
              </View>
            );
          })}

          {/* Start Customer Pagination */}
          <View style={{ paddingBottom: 80, marginVertical: 10 }}>
            <TouchableOpacity>
              <Button
                title={t("show_more")}
                onPress={() => handlePagination()}
                disabled={totalItems > data.length ? false : true}
              />
            </TouchableOpacity>
          </View>
          {/* End Customer Pagination */}
        </View>
      </View>
      {/* End Ticket List */}

      {/* Star Show Image */}
      <Modal animationType="slide" transparent={true} visible={openFile}>
        <View
          style={tw`bg-white m-auto w-[320px] p-3 rounded-lg border-2 shadow-2xl border-gray-300 `}
        >
          <Image
            source={{ uri: file }}
            alt="s"
            style={tw`w-[280px] h-[280px]`}
          />
          <View style={tw`w-full flex-row items-center justify-center`}>
            <TouchableOpacity
              onPress={() => setOpenFile(false)}
              style={tw` bg-[#2196f3] p-3 rounded-lg mx-1 items-center w-[48%]`}
            >
              <Text style={tw`text-white font-bold `}>{t("close")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* End Show Image */}
    </ScrollView>
  );
}
export default SupportContent;
