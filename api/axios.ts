import i18n from "@/i18n";
import axios from "axios";
import { getToken } from "./getToken";

const axiosInstance = axios.create({
  baseURL: "https://getir.logicprodev.com/api",
});
axiosInstance.interceptors.request.use(async (config) => {
  const token = await getToken().then((res: any) => res);
  // const csrfTokenData = await fetchCsrfToken();
  // if (csrfTokenData != null) {
  //   config.headers["XSRF-TOKEN"] = csrfTokenData[0];
  //   config.headers["mobil_store_session"] = csrfTokenData[1];
  // }
  if (config.data instanceof FormData) {
    config.headers["Content-Type"] = "multipart/form-data";
  }

  // إرسال اللغة الحالية من i18n
  const currentLanguage = i18n.language || "ar";
  config.headers["Accept-Language"] = currentLanguage === "ar" ? "sa" : "us";
  config.headers["Set-Language"] = currentLanguage === "ar" ? "sa" : "us";
  config.headers.Authorization = `Bearer ${token}`;
  config.headers["Accept"] = "/";
  console.log("➡️ Request:", {
    url: config.url,
    method: config.method,
    params: config.params,
    data: config.data,
    headers: config.headers,
    token: token,
  });
  return config;
});

export default axiosInstance;
