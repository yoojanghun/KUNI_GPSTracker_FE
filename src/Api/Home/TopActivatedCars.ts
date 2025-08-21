import { api } from "../index";

export interface TopActivatedCar {
  vehicleNumber: string;
  driveCount: number;
}

export async function fetchTopActivatedCars(): Promise<TopActivatedCar[]> {
  const stats = await api.get("api/dashboard/top-vehicles").json<TopActivatedCar[]>();

  return stats;
}