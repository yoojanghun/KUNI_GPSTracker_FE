// 7일간 운행 차량을 그래프로 나타내기
// api/dashboard/status

import { api } from "../index";

export interface CarNum {
  day: string;
  totalCar: number;
}
export interface ActiveCarStat {
  dayCount: CarNum[];
}

export async function fetchActiveCarStat(): Promise<ActiveCarStat> {
  const stats = await api.get("api/dashboard/status").json<ActiveCarStat>();

  return stats;
}
