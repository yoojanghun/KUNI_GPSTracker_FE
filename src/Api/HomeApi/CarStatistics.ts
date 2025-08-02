import { api } from "../index";
import type { CarStatusNum } from "./interfaces/CarStatusNum";

export async function fetchCarStatistics(): Promise<CarStatusNum> {
  const stats = await api.get("api/dashboard").json<CarStatusNum>();

  return stats;
}
