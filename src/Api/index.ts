import ky from 'ky';
import { createHandleResponse } from './hooks/handleResponse';
import { handleRequest } from './hooks/handleRequest';
import { useAuthStore } from '@/Store/Authorization';


const handleResponse = createHandleResponse(() => {
  useAuthStore.getState().logout("expired");
});

export const instance = ky.create({
  prefixUrl: "https://api.gps-tracker.store/", // baseURL 설정, TODO: env로 안전하게 관리
  hooks: {
    beforeRequest: [
      async (request, options) => {

        await handleRequest(request, options);
      }
    ],
     afterResponse: [
      async (request, options, response) => { 

      },
      handleResponse
    ]
  }
});

export const api = instance.extend({
  timeout: 10 * 1000, // 10초 타임아웃,
  // 재시도 요청
  retry: {
    limit: 3, // 재시도 횟수
    statusCodes: [400, 404, 500], // 재시도 진행할 응답코드
    methods: ['get'], // 재시도 진행할 http 메서드
    backoffLimit: 3 * 1000 // 재시도 간격 최대값
  }
})