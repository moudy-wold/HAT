import { AxiosResponse } from "axios";
import axios from "./axios";

export async function GetAllWishlist(): Promise<AxiosResponse<any>> {
  return await axios.get(`/u/wishlist`);
}

export async function Add_Remove_Item(item_id:string,type:"meal" | "vendor",): Promise<AxiosResponse<any>> {
  return await axios.post(`/u/wishlist?type=${type}&id=${item_id}`);
}

 