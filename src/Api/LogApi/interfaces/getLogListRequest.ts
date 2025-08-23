export interface getLogListRequest {
  vehicleNumber?: string,
  startTime?: string,
  endTime?: string,
  sort?: "onTime,ASC" | "onTime,DESC"
  page: number,
  size: number,
  
}