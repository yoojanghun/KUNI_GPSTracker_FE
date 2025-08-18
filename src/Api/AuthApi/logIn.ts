import type { logInRequest, logInResponse } from "./interfaces/logInType";
import { authApi } from "../authIndex";

export const logIn = async (request: logInRequest): Promise<logInResponse> => {
  const data = await authApi.post("api/login", { json: request }).json<logInResponse>();
  return data;
}