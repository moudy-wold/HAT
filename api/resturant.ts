import { AxiosResponse } from "axios";
import axios from "./axios";


export async function GetResturantInfoById(id:string): Promise<AxiosResponse<any>>{
    return await axios.get(`/u/vendor-info/${id}`);
}