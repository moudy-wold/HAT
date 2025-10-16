import Register from "@/Screens/Auth/register/RegisterPage";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "twrnc";
function index() {
  return (
    <SafeAreaView style={tw`flex-1 bg-white `} edges={["top", "bottom"]}>
      <Register />
    </SafeAreaView>
  );
}

export default index;
