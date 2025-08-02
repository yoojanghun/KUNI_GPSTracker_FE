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
