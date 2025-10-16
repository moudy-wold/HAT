import { AxiosResponse } from "axios";
import axios from "./axios";

export async function Get_all_address(): Promise<AxiosResponse<any>> {
  return await axios.get(`/u/addresses`);
}

export async function Add_Address(data: any): Promise<AxiosResponse<any>> {
  return await axios.post(`/u/addresses`, data);
}

export async function Maek_as_default(
  address_id: string
): Promise<AxiosResponse<any>> {
  return await axios.post(
    `/u/addresses/set-as-default/${address_id}?is_default=1`
  );
}

export async function Edit_Address(
  address_id: string,
  data: any
): Promise<AxiosResponse<any>> {
  return await axios.get(`/u/addresses/update/${address_id}`, data);
}

export async function Ddelte_Address(
  address_id: string
): Promise<AxiosResponse<any>> {
  return await axios.delete(`/u/addresses/delete/${address_id}`);
}

export async function Get_zones(): Promise<AxiosResponse<any>> {
  return await axios.get(`/u/services-zone`);
}

export async function Edit_zones(zone_id: string): Promise<AxiosResponse<any>> {
  return await axios.post(`/u/services-zone?service_id=${zone_id}`);
}
