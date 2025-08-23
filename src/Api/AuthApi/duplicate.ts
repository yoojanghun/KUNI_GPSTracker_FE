import type { duplicateRequest, duplicateResponse } from "./interfaces/duplicateType";
import { authApi } from "../authIndex";

export const duplicate = async (request: duplicateRequest): Promise<duplicateResponse> => {
  const data = await authApi.post("api/id/duplicate", { json: request }).json<duplicateResponse>();
  return data;
}