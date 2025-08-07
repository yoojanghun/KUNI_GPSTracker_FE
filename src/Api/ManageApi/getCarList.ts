// src/Api/ManageApi/getCarList.ts
import { api } from "..";
// import { mockApi } from "../mockApi";
import type { getCarListRequest } from "./interfaces/getCarListRequest";
import type { getCarListResponse } from "./interfaces/getCarListResponse";

export const getCarList = async (
  request: getCarListRequest
): Promise<getCarListResponse> => {
  const params = new URLSearchParams();

  params.append("page", request.page.toString());
  params.append("size", request.size.toString());

  if(request.sort) {
    params.append("sort", request.sort);
  }

  if (request.status) {
    params.append("status", request.status);
  }

  if (request.vehicleName) {
    params.append("vehicleName", request.vehicleName);
  }

  const data = await api
    .get(`api/vehicle?${params.toString()}`)
    .json<getCarListResponse>();

  return data;
};