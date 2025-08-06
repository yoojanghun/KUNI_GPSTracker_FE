import { api } from "..";
// import { mockApi } from "../mockApi";
import type { carDeleteRequest } from "./interfaces/carDeleteRequest";


export const carDelete = async (request: carDeleteRequest): Promise<void> => { 
  await api.delete('api/vehicle', {json: { vehicleNumber: request.vehicleNumber}});
}

export const carDeleteMany = async (
  carNumbers: string[],
  onSuccess?: () => void
): Promise<void> => {
  try {
    await Promise.all(
      carNumbers.map((vehicleNumber) =>
        carDelete({ vehicleNumber }).catch((err) =>
          console.error(`차량 ${vehicleNumber} 삭제 실패`, err)
        )
      )
    );

    if (onSuccess) onSuccess();
  } catch (e) {
    console.error("삭제 중 오류 발생", e);
  }
};