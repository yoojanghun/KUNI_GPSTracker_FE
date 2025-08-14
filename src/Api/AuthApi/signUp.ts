import type { signUpRequest, signUpResponse } from "./interfaces/signUpType";
import { api } from "..";

export const SignUpApi = async (request: signUpRequest): Promise<signUpResponse> => {
  const data = await api.post("api/sign-up", { json: request }).json<signUpResponse>();
  return data;
}