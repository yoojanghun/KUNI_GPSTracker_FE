import { api } from "..";
// import { mockApi } from "../mockApi";
import type { carDeleteRequest } from "./interfaces/carDeleteRequest";


export const carDelete = async (request: carDeleteRequest): Promise<void> => { 
  await api.delete(`api/vehicle/${encodeURIComponent(request.vehicleNumber)}`);
}

export const carDeleteMany = async (
  carNumbers: string[],
  onSuccess?: () => void
): Promise<void> => {
  let hasError = false;

  await Promise.all(
    carNumbers.map((vehicleNumber) =>
      carDelete({ vehicleNumber }).catch((err) => {
        console.error(`차량 ${vehicleNumber} 삭제 실패`, err);
        hasError = true;
      })
    )
  );

  if (hasError) {
    throw new Error("일부 차량 삭제 실패");
  }

  if (onSuccess) onSuccess();
};