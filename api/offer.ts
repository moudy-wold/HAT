import { AxiosResponse } from "axios";
import axios from "./axios";

export async function Get_offer_slider(): Promise<AxiosResponse<any>> {
  return await axios.get("/u/offer-slider");
}
