import { api } from "../index";

export interface CarStatusNum {
  vehicles: number;
  active: number;
  inactive: number;
  inspect: number;
}

export async function fetchCarStatistics(): Promise<CarStatusNum> {
  const stats = await api.get("api/dashboard").json<CarStatusNum>();

  return stats;
}
