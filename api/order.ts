import { AxiosResponse } from "axios";
import axios from "./axios";

export async function GetAllOrder(
  status: string[] | undefined,
  page?: number
): Promise<AxiosResponse<any>> {
  return await axios.get(`/u/orders`, {
    params: {
      status,
      page,
    },
    paramsSerializer: (params) => {
      const queryParts: string[] = [];

      if (params.status && Array.isArray(params.status)) {
        params.status.forEach((s: string, i: number) => {
          queryParts.push(`status[${i}]=${encodeURIComponent(s)}`);
        });
      }

      if (params.page !== undefined) {
        queryParts.push(`page=${encodeURIComponent(params.page)}`);
      }

      return queryParts.join("&");
    },
  });
}
// export async function GetOrder_by_filter(
//   status: string,
//   page?: number
// ): Promise<AxiosResponse<any>> {
//   return await axios.get(`/u/orders?status=${status}&page=${page}`);
// }

export async function UpdateQuantity(
  product_id_in_cart: string,
  count: string
): Promise<AxiosResponse<any>> {
  return await axios.post(
    `/api/customer/cart/update-quantity/${product_id_in_cart}?quantity=${count}`
  );
}

export async function ConfirmOrder(
  address_id: string,
  payment_method: string
): Promise<AxiosResponse<any>> {
  return await axios.post(
    `/u/orders?address_id=${address_id}&payment_method=${payment_method}`
  );
}

export async function Resend_order(id: string): Promise<AxiosResponse<any>> {
  return await axios.post(`/u/orders/repeat-order?order_id=${id}`);
}

export async function Evulation_order(
  type: string,
  rateable_id: string,
  order_id: string,
  rating: number,
  comment?: string
): Promise<AxiosResponse<any>> {
  return await axios.post(
    `/u/rating?type=${type}&rateable_id=${rateable_id}&order_id=${order_id}&rating=${rating}&comment=${comment}`
  );
}
