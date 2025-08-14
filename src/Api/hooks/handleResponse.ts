import type { AfterResponseHook } from "ky";
import { useAuthStore } from "@/Store/Authorization";

interface ErrorResponse {
  timeStamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
}

export const handleResponse: AfterResponseHook = async (
  request,
  options,
  response
) => {
  if (!response.ok) {
    // 401 수신 시 전역 로그아웃 실행

    if (response.status === 401) {
      useAuthStore.getState().logout();
      return;
    }
    // 공통 에러 포맷을 사용하는 경우, 필요 시 여기에서 파싱 가능

    const errorData = (await response
      .json()
      .catch(() => null)) as ErrorResponse | null;

    if (errorData) {
      const message = errorData?.message || "Unknown error";

      console.log(
        `request: ${request.body}, options: ${options.body}, response: ${response.body}, message: ${message}`
      );
      throw new Error(message);
    }
  }

  return response;
};
