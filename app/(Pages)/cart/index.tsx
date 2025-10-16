import CartContent from "@/Screens/CartContent/CartContent";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "twrnc";
function Index() {
  return (
    <SafeAreaView style={tw`flex-1 bg-white pb-24`} edges={["top", "bottom"]}>
      <CartContent />
    </SafeAreaView>
  );
}

export default Index;
