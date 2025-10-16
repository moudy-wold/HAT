import { Get_ticket_by_id } from "@/api/ticket";
import Loader from "@/components/Global/Loader/Loader";
import Ticket from "@/Screens/Supoort/ticket/Ticket";
import { useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "twrnc";
function Index() {
  const { id }: any = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const getDate = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await Get_ticket_by_id(id);
      setData(res?.data?.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      getDate();
    }
  }, [id, getDate]);

  return (
    <SafeAreaView style={tw`flex-1 bg-white pb-24`} edges={["top", "bottom"]}>
      <Loader isVisible={isLoading} isLoading={isLoading} />
      <Ticket data={data} id={id} />
    </SafeAreaView>
  );
}
export default Index;
