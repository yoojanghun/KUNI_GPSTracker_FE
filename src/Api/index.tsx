import ky from 'ky';

export const api = ky.create({
  prefixUrl: '', // baseURL 설정
  headers: {
    Authorization: '',
    // 이후 헤더 항목 추가
  },
  hooks: {
    beforeRequest: [() => { console.log('요청 전 실행 함수');
     }],
     afterResponse: [(response) => { console.log("응답 메세지:", response);
      }]
  }
});