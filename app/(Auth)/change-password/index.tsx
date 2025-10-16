import ChangePassword from "@/Screens/Auth/change-password/ChangePasswordPage";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "twrnc";
function index() {
  return (
    <SafeAreaView style={tw`flex-1 bg-white pb-24`} edges={["top", "bottom"]}>
      <ChangePassword />
    </SafeAreaView>
  );
}

export default index;
