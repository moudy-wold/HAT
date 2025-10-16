import { GetResturantInfoById } from "@/api/resturant";
import Loader from "@/components/Global/Loader/Loader";
import ResturantPageContent from "@/Screens/Resturant/ResturantPageContent";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "twrnc";
function Index() {
  const { id }: any = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState();
  const [refreshing, setRefreshing] = useState(false);

  const get_resturant_info = async (id: string) => {
    try {
      const res = await GetResturantInfoById(id);
      setData(res?.data?.data);
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (id) {
      get_resturant_info(id);
    }
  }, [id, refreshing]);
  return (
    <SafeAreaView style={tw`flex-1 bg-white  `} edges={["top", "bottom"]}>
      {isLoading && <Loader />}
      <ResturantPageContent
        data={data}
        refreshing={refreshing}
        setRefreshing={setRefreshing}
      />
    </SafeAreaView>
  );
}

export default Index;
