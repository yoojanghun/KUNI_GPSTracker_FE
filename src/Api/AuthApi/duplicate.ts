import type { duplicateRequest, duplicateResponse } from "./interfaces/duplicateType";
import { api } from "..";

export const duplicate = async (request: duplicateRequest): Promise<duplicateResponse> => {
  const data = await api.post("api/id/duplicate", { json: request }).json<duplicateResponse>();
  return data;
}