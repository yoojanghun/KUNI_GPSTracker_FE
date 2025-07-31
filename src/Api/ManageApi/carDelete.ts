import { api } from "..";
import type { carDeleteRequest } from "./interfaces/carDeleteRequest";


export const carDelete = async (request: carDeleteRequest): Promise<void> => { 
  await api.delete('api/vehicle', {json: { vehicleNumber: request.vehicleNumber}});
 }