import { Get_all_address } from "@/api/address";
import { Get_areas, Get_cities, Get_Governorates } from "@/api/auth";

// Fetch In First
export const getAllAddress = async (setisLoading: any, fn: any) => {
  setisLoading(true);
  try {
    const res = await Get_all_address();

    const addresses = res?.data?.data;
    const defaultAddress = addresses.find((item: any) => item.is_default == 1);

    if (defaultAddress) {
      const filtered = addresses.filter(
        (item: any) => item.id !== defaultAddress.id
      );
      fn([defaultAddress, ...filtered]);
    } else {
      fn(addresses);
    }
  } catch (err) {
    console.error(err);
  } finally {
    setisLoading(false);
  }
};

export const getGovernorates = async (fn: any) => {
  try {
    const res = await Get_Governorates("1");
    fn(res?.data?.data);
  } catch (err: any) {
    console.error(err);
  }
};

export const get_cities = async (e: any, fn: any) => {
  try {
    const res = await Get_cities(e);
    fn(res?.data?.data);
  } catch (err: unknown) {
    console.error(err);
  }
};

export const getAreas = async (city_id: any, fn: any) => {
  try {
    const res = await Get_areas(city_id);
    fn(res?.data?.data);
  } catch (err: any) {
    console.error(err);
  }
};
