import ConfirmeOrderContent from "@/Screens/ConfrimOrder/ConfrimOrderContent";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "twrnc";
function Index() {
  return (
    <SafeAreaView style={tw`flex-1 bg-white`} edges={["top", "bottom"]}>
      <ConfirmeOrderContent />
    </SafeAreaView>
  );
}

export default Index;
