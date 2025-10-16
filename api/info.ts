import { AxiosResponse } from "axios";
import axios from "./axios";

export async function Get_info(): Promise<AxiosResponse<any>> {
    return await axios.get(`/u/info`);
0}

export async function Edit_info(data: any): Promise<AxiosResponse<any>> {
  return await axios.post(`/u/info`, data);
}
 