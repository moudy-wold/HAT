import React, { useState } from "react";
import { useRouter } from "expo-router";
import { Send_response } from "@/api/ticket";
import Loader from "@/components/Global/Loader/Loader";
import { useTranslation } from "react-i18next";
import Toast from "react-native-toast-message";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import tw from "twrnc";

function Ticket({ data, id }: any) {
  const { t, i18n } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState("");
  const [update, setUpdate] = useState(false);
  const handleChange = (e: any) => {
    setResponse(e.target.value);
  };

  const onFinish = async (e: any) => {
    e.preventDefault();
    if (data?.status == "In Progress") {
      setIsLoading(true);

      try {
        await Send_response(id, response);
        setUpdate(!update);
        setIsLoading(false);
        setResponse("");
      } catch (err: any) {
        console.log(err.response.data);
        Toast.show({
          type: "error",
          text1: err.response.data?.message,
        });
        setIsLoading(false);
      }
    } else if (data?.status == "Open") {
      Toast.show({
        type: "error",
        text1: t("waiting_for_response_from_support_center"),
      });
    } else {
      Toast.show({
        type: "error",
        text1: t("topic_is_finished"),
      });
    }
  };
  return (
    <ScrollView
      contentContainerStyle={[
        tw`p-4`,
        { direction: i18n.language == "ar" ? "rtl" : "ltr" },
      ]}
    >
      <View>
        <Loader isVisible={isLoading} isLoading={isLoading} />
      </View>

      <View>
        {/* Start Subject */}
        <View style={tw`mx-auto`}>
          <Text style={tw`text-center mt-2`}>{data?.created_at}</Text>
          <View style={tw`flex-row items-center justify-center gap-3 mt-2`}>
            <Text style={tw`text-center`}>{t("subject")}</Text>
            <Text style={tw`text-center`}>{data?.subject}</Text>
          </View>
          <View style={tw`flex-row items-center justify-between mt-2 gap-2`}>
            <Text>{t("the_status")}</Text>
            <Text style={tw`w-fit bg-[#fc6011] text-white rounded-lg p-2`}>
              {data?.status === "Open" && t("under_study")}
              {data?.status === "In Progress" && t("under_processing")}
              {data?.status === "Closed" && t("closed")}
            </Text>
          </View>
        </View>
        {/* End Subject */}

        {/* Start Description */}
        <Text style={tw`text-center text-lg mt-5`}>{data?.description}</Text>
        {/* End Description */}

        {/* Start Show Responses */}
        <View>
          {data?.ticket_responses?.map((item: any, index: number) => (
            <View
              style={tw`border-t-2 border-gray-300 p-5 my-5`}
              key={item?.id || index}
            >
              <Text>
                {item.created.includes("Support") && t("from_support")}
              </Text>
              <Text
                style={tw`mt-2 ${
                  item.created.includes("Support") ? "text-left" : "text-right"
                }`}
              >
                {item.response}
              </Text>
            </View>
          ))}
        </View>
        {/* End Show Responses */}

        {/* Start Input */}
        <View style={tw`border-t-2 border-gray-300 mt-20 p-5`}>
          <View>
            <TextInput
              id="response"
              multiline
              numberOfLines={5}
              onChangeText={handleChange}
              value={response}
              style={tw`border-2 border-gray-300 rounded-md p-2  placeholder-gray-500`}
              placeholder={t("leave_your_response_here....")}
              editable={data?.can_user_response == "1"}
            />
            <TouchableOpacity
              onPress={onFinish}
              style={tw`p-2 px-4 text-lg rounded-lg mt-4 border-2 border-[#fc6011] bg-[#fc6011] text-white ${
                data?.can_user_response == "1"
                  ? "hover:bg-white hover:text-[#fc6011]"
                  : ""
              }`}
              disabled={data?.can_user_response != "1"}
            >
              <Text style={tw`text-center text-white`}>{t("send")}</Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* End Input */}
      </View>
    </ScrollView>
  );
}
export default Ticket;
