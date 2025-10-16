import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default async function fetchCsrfTokens() {
  try {
    const res = await axios.get(
      "https://getir.logicprodev.com/sanctum/csrf-cookie",
      {
        withCredentials: true,
      }
    );

    const setCookieHeaders = res.headers["set-cookie"] || [];
    const xsrfToken = setCookieHeaders
      .find((cookie) => cookie.includes("XSRF-TOKEN"))
      ?.split("XSRF-TOKEN=")[1]
      ?.split(";")[0];

    const mobilStoreSession = setCookieHeaders
      .find((cookie) => cookie.includes("mobil_store_session"))
      ?.split("mobil_store_session=")[1]
      ?.split(";")[0];

    if (xsrfToken && mobilStoreSession) {
      await AsyncStorage.setItem("XSRF-TOKEN", xsrfToken);
      await AsyncStorage.setItem("mobil_store_session", mobilStoreSession);
      return [xsrfToken, mobilStoreSession];
    }

    return null;
  } catch (error) {
    console.error("Error fetching CSRF token:", error);
    return null;
  }
}
