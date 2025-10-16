import AsyncStorage from "@react-native-async-storage/async-storage";

export const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem("access_token");

    return token ? token : null;
  } catch (error) {
    console.error("Error retrieving the token:", error);
    return null;
  }
};
