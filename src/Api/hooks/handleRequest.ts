import type { BeforeRequestHook } from "ky";
import { useAuthStore } from "@/Store/Authorization";
import { validateToken } from "../AuthApi/validate";

export const handleRequest: BeforeRequestHook = async (request) => {


  // 인증 토큰을 전역 상태에서 읽어와 토큰 유효성 검증 및 헤더에 주입
  const token = useAuthStore.getState().token;
  const setUserId = useAuthStore.getState().setUserId;



  if (token) {

    const validate = await validateToken({Authorization: token});

    if(validate.valid){
      setUserId(validate.loginId);
      request.headers.set("Authorization", `Bearer ${token}`);

    }
    else{

      useAuthStore.getState().logout("expired");
    }
    
  }

  // POST 요청일 경우 Content-Type 헤더 추가, TODO: 헤더별로 ky 인스턴스 분리
  if (request.method === "POST") {
    request.headers.set("Content-Type", "application/json");
  }
};
