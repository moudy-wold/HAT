import OTPCode from "@/Screens/Auth/OTPCode/OTPCodePage";
import React from "react";
import { StyleSheet, View } from "react-native";

function index() {
  return (
    <View style={styles.container}>
      <OTPCode />
    </View>
  );
}

export default index;

const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
    padding: 20,
    justifyContent: "center",
  },
});
