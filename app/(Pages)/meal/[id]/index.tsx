import { GetMealDetails } from "@/api/meals";
import MealContent from "@/Screens/Meal/MealContent";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { RefreshControl, ScrollView } from "react-native";

function Index() {
  const { id }: any = useLocalSearchParams();
  const [data, setData] = useState<any>({});
  const [refreshing, setRefreshing] = useState(false);

  const getData = async (id: string) => {
    try {
      const res = await GetMealDetails(id);
      setData(res?.data);
    } catch (err: any) {
      console.log(err.response.data.message);
    }
  };
  useEffect(() => {
    getData(id);
  }, [id]);

  const onRefresh = async () => {
    setRefreshing(true);
    await getData(id);
    setRefreshing(false);
  };
  return (
    <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={["#2196f3"]}
        />
      }
    >
      <MealContent data={data?.data} />
    </ScrollView>
  );
}

export default Index;
