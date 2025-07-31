export interface getLogListRequest {
  vehicleNumber?: string,
  startTime?: string,
  endTime?: string,
  pageable: number;
}