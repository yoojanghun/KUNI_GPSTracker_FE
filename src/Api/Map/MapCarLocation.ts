// 각 차량별 위도와 경도 (1초마다 변함?)

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