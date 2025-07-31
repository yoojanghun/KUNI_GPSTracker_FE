export interface getLogListRequest {
  vehicleNumber?: string,
  startTime?: string,
  endTime?: string,
  sort?: "asc" | "desc"
  page: number,
  size: number,
  
}