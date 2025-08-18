import type {
  validateRequest,
  validateResponse,
} from "./interfaces/validateType";
import { authApi } from "../authIndex";

export const validateToken = async (
  request: validateRequest
): Promise<validateResponse> => {

  const data = await authApi
    .get("api/token/validate")
    .json<validateResponse>();
  return data;
};
