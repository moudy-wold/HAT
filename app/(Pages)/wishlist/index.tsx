import WishlistContent from "@/Screens/Wishlist/WishlistContent";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "twrnc";
function Index() {
  return (
    <SafeAreaView style={tw`flex-1 bg-white pb-24`} edges={["top", "bottom"]}>
      <WishlistContent />
    </SafeAreaView>
  );
}

export default Index;
