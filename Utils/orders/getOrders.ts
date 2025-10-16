import { GetAllOrder } from "@/api/order";

export async function fetchOrders(
  statuses: string[] | undefined,
  page: number = 1
) {
  try {
    const res = await GetAllOrder(statuses, page);
    return res?.data?.data;
  } catch (err: any) {
    console.error(err);
    throw err;
  }
}
