import { AxiosResponse } from "axios";
import axios from "./axios";

export async function Create_ticket(data: any): Promise<AxiosResponse<any>> {
  return await axios.post(`/u/support-ticket`, data);
}

export async function Get_all_tickets(
  page: number
): Promise<AxiosResponse<any>> {
  return await axios.get(`/u/support-ticket?page=${page}`);
}

export async function Get_ticket_by_id(
  id: string
): Promise<AxiosResponse<any>> {
  return await axios.get(`/u/support-ticket/show/${id}`);
}

export async function Send_response(
  ticket_id: string,
  response: string
): Promise<AxiosResponse<any>> {
  return await axios.post(
    `/u/support-ticket/response/${ticket_id}?response=${response}`
  );
}
