import { AxiosResponse } from "axios";
import axios from "./axios";

export async function GetAllNotifications(
  page?: number
): Promise<AxiosResponse<any>> {
  return await axios.get(`/u/notifications?page=${page}`);
}

export async function SetNotoficationAsReadById(
  id: string
): Promise<AxiosResponse<any>> {
  return await axios.post(`/u/notifications-set-read?notification_id=${id}`);
}

export async function SetAllNotoficationAsRead(): Promise<AxiosResponse<any>> {
  return await axios.post(`/u/notifications-all-read`);
}

export async function DeleteNotoficationById(
  id: string
): Promise<AxiosResponse<any>> {
  return await axios.delete(`/u/notifications-delete?notification_id=${id}`);
}

export async function DeleteAllNotifications(): Promise<AxiosResponse<any>> {
  return await axios.delete(`/u/notifications-delete-all`);
}

export async function updateTokenToBackend(
  token: string
): Promise<AxiosResponse<any>> {
  return await axios.post(`/update-token-firebase?token=${token}`);
}
