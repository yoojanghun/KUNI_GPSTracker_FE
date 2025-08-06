import type { getLogDetailRequest } from "./interfaces/getLogDetailRequest";
import type { getLogDetailResponse } from "./interfaces/getLogDetailResponse";
// import { mockApi } from "../mockApi";
import { api } from "..";

export const getLogDetail = async (request:getLogDetailRequest): Promise<getLogDetailResponse> => { 

  const data = await api
  .get(`api/record/${request.id}`)
  .json<getLogDetailResponse>();

  return data;
 }