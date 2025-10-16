import { useRouter } from "expo-router";
import { useEffect } from "react";
import axiosInstance from "./axios";

export default function AxiosInterceptor() {
  const router = useRouter();

  useEffect(() => {
    const interceptor = axiosInstance.interceptors.response.use(
      (response) => response,
      async (error: any) => {
        console.log(error, "Error from Main Axios Interceptor");

        if (
          error?.response?.data?.message == "Unauthorized" ||
          error?.response?.data?.message == "Unauthenticated."
        ) {
          console.log(
            error?.response?.data,
            "Unauthorizeddddddddddddddddddddddd"
          );
          router.replace("/(Auth)/login");
        }

        if (error?.response?.status === 403) {
          console.log(403, "forbidennnn");
          router.replace("/(Auth)/login");
        }

        return Promise.reject(error);
      }
    );

    return () => {
      axiosInstance.interceptors.response.eject(interceptor);
    };
  }, [router]);

  return null;
}
