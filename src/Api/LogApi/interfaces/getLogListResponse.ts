export interface dlog {
  id: number,
  vehicleNumber: string,
  vehicleName: string,
  onTime: string,
  offTime: string,
  sumDist: string
}
export interface getLogListResponse {
  totalPages: number,
  totalElements: number,
  content: dlog[]
}