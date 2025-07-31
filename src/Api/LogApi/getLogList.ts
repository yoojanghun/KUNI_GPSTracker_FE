import type { getLogListRequest } from "./interfaces/getLogListRequest";
import type { getLogListResponse } from "./interfaces/getLogListResponse";
// import { api } from "..";
import { mockApi } from "../mockApi";

export const getLogList = async (request:getLogListRequest): Promise<getLogListResponse> => { 
  const params = new URLSearchParams();

  params.append("page", request.page.toString());
  params.append("size", request.size.toString());
  if (request.sort){
    params.append("sort", request.sort);
  }
  if (request.endTime){
    params.append("endTime", request.endTime);
  }
  if (request.startTime){
    params.append("startTime", request.startTime);
  }
  if (request.vehicleNumber){
    params.append("vehicleNumber", request.vehicleNumber);
  }


  const data = await mockApi
  .get(`api/record?${params.toString()}`)
  .json<getLogListResponse>();

  return data;
 }