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

export async function fetchMapCarLocation(): Promise<MapCarLocation> {
    const stats = await api.get("api/dashboard/map").json<MapCarLocation>();

    return stats;
}