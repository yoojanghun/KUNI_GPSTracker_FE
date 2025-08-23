import type { AfterResponseHook } from "ky";

interface ErrorResponse {
  timeStamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
}


// 순환 참조 문제를 해결하기 위해 logout 함수 외부에서 주입하도록 변경
export const createHandleResponse = (logoutFn: () => void): AfterResponseHook => {
  return async (request, options, response) => {
    if (!response.ok) {
      if (response.status === 401) {
        logoutFn();
        return;
      }

      const errorData = (await response.json().catch(() => null)) as ErrorResponse | null;
      if (errorData) {
        const message = errorData?.message || "Unknown error";

        throw response;
      }
    }

    return response;
  };
};