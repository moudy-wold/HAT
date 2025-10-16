import { AxiosResponse } from "axios";
import axios from "./axios";

export async function GetAllCart(): Promise<AxiosResponse<any>> {
  return await axios.get(`/u/cart`);
}

export async function Add_To_Cart(data: any): Promise<AxiosResponse<any>> {
  return await axios.post(`/u/cart/add-to-cart`, data);
}

export async function Ddelte_Cart(
  cart_id: string
): Promise<AxiosResponse<any>> {
  return await axios.delete(`/u/cart/remove/${cart_id}`);
}

export async function Update_quantity(
  cart_id: string,
  quantity: number
): Promise<AxiosResponse<any>> {
  return await axios.post(
    `/u/cart/update-quantity?cart_item_id=${cart_id}&quantity=${quantity}`
  );
}
