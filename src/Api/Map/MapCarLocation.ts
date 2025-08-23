// 각 차량별 위도와 경도 (중간발표 이전까진 60초에 정보 요청, 중간발표 이후에 더 짧은 주기로 요청)
// (중간발표 이후엔 상태만 변한것을 3초마다 요청)
// api/dashboard/map

import { api } from "../index";

export interface CarLocation {
	latitude: number;
	longitude: number;
	status: string;
	vehicleNumber: string;
	type: string;
}

export type MapCarLocation = CarLocation[];

// searchParams에 차량 number들을 집어넣을 예정
export async function fetchMapCarLocation(vehicleNumbers: string[] = []): Promise<MapCarLocation> {
  const searchParams = new URLSearchParams();
  for (const vehicleNum of vehicleNumbers) {		// 반복 가능한 객체를 순회하며(문자열, 배열 등) 값을 꺼냄
    searchParams.append("vehicleNumbers", vehicleNum); 
  }

  const stats = await api
    .get("api/dashboard/map", { searchParams: searchParams })
    .json<MapCarLocation>();

  return stats;
}

// new URLSearchParams()는 URL의 쿼리스트링(?key=value&key2=value2)을 만들어 주는 내장 객체
// const params = new URLSearchParams();
// params.append("name", "janghun");
// params.append("age", "22");
// => name=janghun&age=25 이런식으로 쿼리 스트링이 붙게 된다.	