interface record {
  id: number,
  vehicleNumber: string,
  vehicleName: string,
  onTime: string,
  offTime: string,
  sumDist: string
}
export interface getLogListResponse {
  totalPage: number,
  totalElements: number,
  content: record[]
}