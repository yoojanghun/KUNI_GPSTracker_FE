import type { logInRequest, logInResponse } from "./interfaces/logInType";
import { api } from "..";

export const logIn = async (request: logInRequest): Promise<logInResponse> => {
  const data = await api.post("api/login", { json: request }).json<logInResponse>();
  return data;
}