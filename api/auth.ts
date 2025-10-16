import { AxiosResponse } from "axios";
import axios from "./axios";

export async function Register(data: any): Promise<AxiosResponse<any>> {
  return await axios.post(`/auth/register`, data);
}

export async function Login(
  phoneNumber: any,
  password: any
): Promise<AxiosResponse<any>> {
  return await axios.post(
    `/auth/login?phoneNumber=${phoneNumber}&password=${password}&user_type=customer`
  );
}

export async function Login_with_google(): Promise<AxiosResponse<any>> {
  return await axios.post(`/auth/redirect/google?user_type=customer`);
}

export async function CompleteInfo(
  gender: string,
  phoneNumber: string
): Promise<AxiosResponse<any>> {
  return await axios.post(
    `auth/complete-register?user_type=customer&gender=${gender}&phoneNumber=${phoneNumber}`
  );
}

export async function LogOut(): Promise<AxiosResponse<any>> {
  return await axios.get(`/auth/logout`);
}

export async function ForgetPass(email: string): Promise<AxiosResponse<any>> {
  return await axios.post(`/auth/forgot?email=${email}&user_type=customer`);
}

export async function ResetPass(
  email: string,
  otp: string,
  password: string
): Promise<AxiosResponse<any>> {
  return await axios.post(
    `/auth/reset?otp=${otp}&email=${email}&password=${password}&user_type=customer`
  );
}
export async function ConfirmOTP(otp: any): Promise<AxiosResponse<any>> {
  return await axios.post(`/auth/email/verify-otp?otp=${otp}`);
}

export async function SendEmail(email: string): Promise<AxiosResponse<any>> {
  return await axios.post(`/api/email/`, email);
}

export async function ResendOTP(): Promise<AxiosResponse<any>> {
  return await axios.post(`/auth/email/resend`);
}

export async function Get_Governorates(
  country_id: string
): Promise<AxiosResponse<any>> {
  return await axios.get(`/locations/governorates/${country_id}`);
}

export async function Get_cities(city_id: string): Promise<AxiosResponse<any>> {
  return await axios.get(`/locations/cities/${city_id}`);
}

export async function Get_areas(city_id: string): Promise<AxiosResponse<any>> {
  return await axios.get(`/locations/areas/${city_id}`);
}
