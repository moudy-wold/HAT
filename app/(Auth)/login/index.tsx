import Login from "@/Screens/Auth/login/LoginPage";
import React from "react";
import { StyleSheet, View } from "react-native";

function index() {
  return (
    <View style={styles.container}>
      <Login />
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
