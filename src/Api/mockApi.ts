import ky from 'ky';
import { createHandleResponse } from './hooks/handleResponse';
import { useAuthStore } from '@/Store/Authorization';

const handleResponse = createHandleResponse(() => {
  useAuthStore.getState().logout("expired");
});

export const instance = ky.create({
  prefixUrl: 'http://localhost:5173', // baseURL 설정
  // headers: {
  //   Authorization: '',
  //   // 이후 헤더 항목 추가
  // },
  hooks: {
    beforeRequest: [
      async (request) => {
        if (request.method === 'POST') {
          request.headers.set('Content-Type', 'application/json');
        }
      }
    ],
     afterResponse: [
      (response) => { 

      },
      handleResponse
    ]
  }
});

export const mockApi = instance.extend({
  timeout: 10 * 1000, // 10초 타임아웃,
  // 재시도 요청
  retry: {
    limit: 5, // 재시도 횟수
    statusCodes: [401, 400, 500], // 재시도 진행할 응답코드
    methods: ['get', 'post', 'delete'], // 재시도 진행할 http 메서드
    backoffLimit: 3 * 1000 // 재시도 간격 최대값
  }
})