import type {
  validateRequest,
  validateResponse,
} from "./interfaces/validateType";
import { validateApi } from "../validateIndex";

export const validateToken = async (
  request: validateRequest
): Promise<validateResponse> => {
  const data = await validateApi
    .get("api/token/validate", {
      headers: {
        Authorization: `Bearer ${request.Authorization}`,
      },
    })
    .json<validateResponse>();
  return data;
};
