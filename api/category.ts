import { AxiosResponse } from "axios";
import axios from "./axios";

export async function GetAllMainCategories(): Promise<AxiosResponse<any>> {
  return await axios.get(`/u/categories`);
}

export async function GetAll_sub_Categories_by_main_id(
  main_id: string
): Promise<AxiosResponse<any>> {
  return await axios.get(`/u/sub-categories/${main_id}`);
}

export async function Get_All_subCateg_for_Resturant_by_main_category_id(
  resturant_id: string,
  main_category_id: string
): Promise<AxiosResponse<any>> {
  return await axios.get(
    `/u/vendor-info/${resturant_id}?category_id=${main_category_id}`
  );
}

export async function GetAll_maels_for_sub_by_sub_id(
  sub_id: string
): Promise<AxiosResponse<any>> {
  return await axios.get(`/u/meals-categories/${sub_id}`);
}
