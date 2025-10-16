import { Get_random_meals } from "@/api/layout";
import { Popular_search_world } from "@/api/search";
import SearchPage from "@/Screens/Search/SearchContent";
import React, { useEffect, useState } from "react";
import { RefreshControl, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "twrnc";
export default function Search() {
  const [popular_data, set_popular_data] = useState([]);
  const [random_meal, set_random_meal] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const get_popular_data = async () => {
    try {
      const res = await Popular_search_world();
      set_popular_data(res?.data?.data);
    } catch (err: any) {
      console.error(err);
    }
  };
  const get_random_meals = async () => {
    try {
      const res = await Get_random_meals();
      set_random_meal(res?.data?.data);
    } catch (err: any) {
      console.error(err);
    }
  };
  useEffect(() => {
    get_popular_data();
    get_random_meals();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await get_popular_data();
    await get_random_meals();
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-white pb-24`} edges={["top", "bottom"]}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#2196f3"]}
          />
        }
        style={{ backgroundColor: "#fff", height: "100%" }}
      >
        <SearchPage popular_data={popular_data} random_meal={random_meal} />
      </ScrollView>
    </SafeAreaView>
  );
}
