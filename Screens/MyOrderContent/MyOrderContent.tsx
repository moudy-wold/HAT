import { GetAllOrder } from "@/api/order";
import Loader from "@/components/Global/Loader/Loader";
import TitleAndBackButton from "@/components/Global/TitleAndBackButton/TitleAndBackButton";
import MyOrderCard from "@/components/Pages/MyOrder/MyOrderCard";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FlatList,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import tw from "twrnc";

function MyOrderContent() {
  const { t, i18n } = useTranslation();
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [orders, setOrders] = useState<any>([]);
  const [lastPage, setLastPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(["all"]);

  // جميع الحالات المتاحة
  const allStatuses = [
    { key: "all", label: t("all") },
    { key: "pending", label: t("pending") },
    { key: "preparing", label: t("preparing") },
    { key: "on_the_way", label: t("on_the_way") },
    { key: "delivered", label: t("delivered") },
    { key: "rejected_vendor", label: t("rejected_vendor") },
  ];

  const getData = async (reset = false, pageNumber = 1) => {
    setIsLoading(true);
    try {
      let statusesToFetch = [];
      if (selectedStatuses.includes("all") || selectedStatuses.length === 0) {
        statusesToFetch = [
          "pending",
          "preparing",
          "on_the_way",
          "accepted_driver",
          "delivered",
          "rejected_vendor",
        ];
      } else {
        statusesToFetch = selectedStatuses.filter((status) => status !== "all");
        statusesToFetch.push("accepted_driver"); // إضافة هذه الحالة دائماً
      }

      const res = await GetAllOrder(statusesToFetch, pageNumber);
      if (reset) {
        setOrders(res?.data?.data || []);
      } else {
        setOrders((prev: any) => [...prev, ...res?.data?.data]);
      }
      setLastPage(res?.data?.pagination?.last_page || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getData(false, page);
  }, [page]);

  // إعادة تحميل البيانات عند تغيير الفلاتر
  useEffect(() => {
    setPage(1);
    getData(true, 1);
  }, [selectedStatuses]);

  const handleLoadMore = () => {
    if (!isLoading && page < lastPage) {
      setPage((prev) => prev + 1);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    setPage(1);
    await getData(true, 1);
    setRefreshing(false);
  };

  // دالة تبديل حالة الفلتر
  const toggleStatusFilter = (statusKey: string) => {
    if (statusKey === "all") {
      setSelectedStatuses(["all"]);
    } else {
      setSelectedStatuses((prev) => {
        const newStatuses = prev.filter((s) => s !== "all");
        if (newStatuses.includes(statusKey)) {
          // إزالة الحالة
          const filtered = newStatuses.filter((s) => s !== statusKey);
          return filtered.length === 0 ? ["all"] : filtered;
        } else {
          // إضافة الحالة
          return [...newStatuses, statusKey];
        }
      });
    }
  };

  // دالة لتحديد إذا كانت الحالة مختارة
  const isStatusSelected = (statusKey: string) => {
    if (statusKey === "all") {
      return selectedStatuses.includes("all");
    }
    return (
      selectedStatuses.includes(statusKey) && !selectedStatuses.includes("all")
    );
  };
  return (
    <View
      style={[tw`p-4`, { direction: i18n.language == "ar" ? "rtl" : "ltr" }]}
    >
      {isLoading && <Loader />}
      {/* Start Title && Back Button */}
      <TitleAndBackButton title={t("previous_orders")} />
      {/* End Title && Back Button */}

      {/* Start Status Filter */}
      <View style={tw`mb-4`}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={tw`flex-row`}
          contentContainerStyle={tw`pb-2`}
        >
          {allStatuses.map((status) => {
            const isSelected = isStatusSelected(status.key);
            return (
              <TouchableOpacity
                key={status.key}
                onPress={() => toggleStatusFilter(status.key)}
                style={[
                  tw`mr-3 px-4 py-2 rounded-full border-2`,
                  isSelected
                    ? tw`bg-[#fc6011] border-[#fc6011]`
                    : tw`bg-white border-gray-300`,
                ]}
              >
                <Text
                  style={[
                    tw`font-medium`,
                    isSelected ? tw`text-white` : tw`text-gray-600`,
                  ]}
                >
                  {status.label}
                  {status.key !== "all" && isSelected && (
                    <Text style={tw`ml-1`}> ✓</Text>
                  )}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
      {/* End Status Filter */}
      {orders.length === 0 && !isLoading ? (
        <View style={tw` justify-center items-center p-4`}>
          <MaterialCommunityIcons name="inbox" size={64} color="#fc6011" />
          <Text style={tw`text-lg text-gray-500 mt-2`}>{t("no_data_yet")}</Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View key={item?.id}>
              <MyOrderCard item={item} t={t} show_info={true} />
            </View>
          )}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#2196f3"]}
            />
          }
          ListFooterComponent={
            page < lastPage && !refreshing ? (
              <TouchableOpacity
                onPress={handleLoadMore}
                style={tw`bg-[#fc6011] py-3 px-4 rounded-xl mt-6 mb-10`}
              >
                <Text style={tw`text-white text-center`}>
                  {isLoading ? t("loading") : t("load_more")}
                </Text>
              </TouchableOpacity>
            ) : null
          }
        />
      )}
    </View>
  );
}

export default MyOrderContent;
