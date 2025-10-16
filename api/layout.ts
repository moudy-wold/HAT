import { AxiosResponse } from "axios";
import axios from "./axios";

export async function Get_layout(): Promise<AxiosResponse<any>> {
  return await axios.get(`/u/layouts-home-page`);
}

export async function Most_ordered_meals(
  page: string
): Promise<AxiosResponse<any>> {
  return await axios.get(`/u/top-selling-meals?page=${page}`);
}

export async function Top_rated_restaurants(
  page: string
): Promise<AxiosResponse<any>> {
  return await axios.get(`/u/top-rated-vendors?page=${page}`);
}

export async function Suggested_meals(
  page: string
): Promise<AxiosResponse<any>> {
  return await axios.get(`/u/top-interests-meals?page=${page}`);
}

export async function Get_random_meals(
  page?: string
): Promise<AxiosResponse<any>> {
  return await axios.get(`/u/random-meals?page=${page}`);
}

export async function New_restaurants(
  page: string
): Promise<AxiosResponse<any>> {
  return await axios.get(`/u/random-meals?page=${page}`);
}

export async function Try_something_new(
  page: string
): Promise<AxiosResponse<any>> {
  return await axios.get(`/u/top-selling-meals?page=${page}`);
}

export async function best_offers(page: string): Promise<AxiosResponse<any>> {
  return await axios.get(`/u/top-selling-meals?page=${page}`);
}
