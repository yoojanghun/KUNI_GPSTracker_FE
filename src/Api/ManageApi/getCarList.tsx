import { api } from "..";
import type { getCarListRequest } from "./interfaces/getCarListRequest";
import type { getCarListResponse } from "./interfaces/getCarListResponse";

export const getCarList = async (
  request: getCarListRequest
): Promise<getCarListResponse> => {
  const params = new URLSearchParams();

  params.append("page", request.page.toString());
  params.append("sort", request.sort);

  if (request.status) {
    params.append("status", request.status);
  }

  if (request.vehicleNumber) {
    params.append("vehicleNumber", request.vehicleNumber);
  }

  const data = await api
    .get(`api/vehicle?${params.toString()}`)
    .json<getCarListResponse>();

  return data;
};