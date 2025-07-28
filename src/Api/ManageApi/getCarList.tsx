import { api } from "..";
import type { getCarListRequest } from "./interfaces/getCarListRequest";
import type { getCarListResponse } from "./interfaces/getCarListResponse";

export const getCarList = async (
  request: getCarListRequest
): Promise<getCarListResponse> => {
  const data = await api
    .get(
      `api/vehicle?&page=${request.page}&sort=${request.sort}${
        request.status ? `&status=${request.status}` : ""
      }${
        request.vehicleNumber ? `&vehicleNumber=${request.vehicleNumber}` : ""
      }`
    )
    .json<getCarListResponse>();

  return data;
};
