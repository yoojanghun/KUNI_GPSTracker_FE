import type { getLogDetailRequest } from "./interfaces/getLogDetailRequest";
import type { getLogDetailResponse } from "./interfaces/getLogDetailResponse";
import { api } from "..";
import { mockApi } from "../mockApi";

export const getLogDetail = async (request:getLogDetailRequest): Promise<getLogDetailResponse> => { 

  const data = await mockApi
  .get(`api/record/${request.id}`)
  .json<getLogDetailResponse>();

  return data;
 }