import EditProfileContent from "@/Screens/ProfilePages/EditProfile/EditProfileContent";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "twrnc";
function Index() {
  return (
    <SafeAreaView style={tw`flex-1 bg-white`} edges={["top", "bottom"]}>
      <EditProfileContent />
    </SafeAreaView>
  );
}

export default Index;
