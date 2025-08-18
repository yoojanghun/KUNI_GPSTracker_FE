import type { signUpRequest, signUpResponse } from "./interfaces/signUpType";
import { authApi } from "../authIndex";

export const SignUpApi = async (request: signUpRequest): Promise<signUpResponse> => {
  const data = await authApi.post("api/sign-up", { json: request }).json<signUpResponse>();
  return data;
}