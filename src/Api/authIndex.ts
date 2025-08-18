import ky from "ky";
import { handleResponse } from "./hooks/handleResponse";
import { useAuthStore } from "@/Store/Authorization";
import { validateToken } from "./AuthApi/validate";

export const instance = ky.create({
  prefixUrl: "https://api.gps-tracker.store/", // baseURL 설정, TODO: env로 안전하게 관리
  hooks: {
    beforeRequest: [
      async (request) => {

        const token = useAuthStore.getState().token;

        console.log("token: ", token);

        if (token) {
          const validate = await validateToken({Authorization: token});
          if(validate.valid){
            request.headers.set("Authorization", `Bearer ${token}`);
          }
          
        }

        // POST 요청일 경우 Content-Type 헤더 추가, TODO: 헤더별로 ky 인스턴스 분리
        if (request.method === "POST") {
          request.headers.set("Content-Type", "application/json");
        }
      },
    ],
    afterResponse: [
      async (request, options, response) => {
        console.log("응답 메세지:", response);
      },
      handleResponse,
    ],
  },
});

export const authApi = instance.extend({
  timeout: 10 * 1000, // 10초 타임아웃,
  // 재시도 요청
  retry: {
    limit: 5, // 재시도 횟수
    statusCodes: [400, 404, 500], // 재시도 진행할 응답코드
    methods: ["get"], // 재시도 진행할 http 메서드
    backoffLimit: 3 * 1000, // 재시도 간격 최대값
  },
});
