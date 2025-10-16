import { AxiosResponse } from "axios";
import axios from "./axios";

export async function Search(
  value: string,
  meals_page: number,
  vendors_page?: number
): Promise<AxiosResponse<any>> {
  return await axios.post(
    `/u/search-meals-vendors?search=${value}&meals_page=${meals_page}&vendors_page=${vendors_page}`
  );
}

export async function Popular_search_world(): Promise<AxiosResponse<any>> {
  return await axios.get(`/u/popular/search-word`);
}
