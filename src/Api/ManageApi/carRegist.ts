import { api } from "..";
import type { carRegistRequest } from "./interfaces/carRegistRequest";
import type { carRegistResponse } from "./interfaces/carRegistResponse";


export const carRegist = async (request: carRegistRequest): Promise<carRegistResponse> => { 
  const data = await api
  .post('api/vehicle', {json: { vehicleNumber: request.vehicleNumber, vehicleName: request.vehicleName}})
  .json<carRegistResponse>();

  return data;
 }