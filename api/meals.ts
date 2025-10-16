import { AxiosResponse } from "axios";
import axios from "./axios";

export async function GetMealDetails(
  meal_id: string
): Promise<AxiosResponse<any>> {
  return await axios.get(`/u/meal/${meal_id}`);
}

export async function Get_Meals_for_Resturant_by_sub_category_id(
  resturant_id: string,
  sub_category_id: string
): Promise<AxiosResponse<any>> {
  return await axios.get(
    `/u/vendor-meals/${resturant_id}?category_id=${sub_category_id}`
  );
}
export async function GetMealQuestions(
  meal_id: string,
  page: number
): Promise<AxiosResponse<any>> {
  return await axios.get(
    `/u/meal-questions-views?meal_id=${meal_id}&page=${page}`
  );
}

export async function AddQuestion(
  meal_id: string,
  question: string
): Promise<AxiosResponse<any>> {
  return await axios.post(
    `/u/question-store?meal_id=${meal_id}&question=${question}`
  );
}
