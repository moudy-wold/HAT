import { GetAll_sub_Categories_by_main_id } from "@/api/category";
import CategoryContent from "@/Screens/Category/CategoryContent";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "twrnc";
function Index() {
  const { id }: any = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [sub_categories, set_sub_catrgories] = useState([]);
  const getData = async () => {
    setIsLoading(true);
    try {
      const res = await GetAll_sub_Categories_by_main_id(id);
      set_sub_catrgories(res?.data?.data);
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    getData();
  }, []);
  return (
    <SafeAreaView style={tw`flex-1 bg-white pb-24`} edges={["top", "bottom"]}>
      <CategoryContent sub_categories={sub_categories} />
    </SafeAreaView>
  );
}

export default Index;
