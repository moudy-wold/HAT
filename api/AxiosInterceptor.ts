import useStore from "@/store/useStore";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import axiosInstance from "./axios";

export default function AxiosInterceptor() {
  const router = useRouter();
  const { setRatingModal } = useStore();

  useEffect(() => {
    const interceptor = axiosInstance.interceptors.response.use(
      (response) => response,
      async (error: any) => {
        console.log(error?.response?.data, "Error from Main Axios Interceptor");

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

        if (
          error?.response?.data?.message ==
          "You must complete your order review before proceeding."
        ) {
          console.log(
            403,
            "You must complete your order review before proceeding."
          );
          setRatingModal(true);
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
