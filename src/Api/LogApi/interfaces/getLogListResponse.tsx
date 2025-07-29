interface record {
  id: number,
  vehicleNumber: string,
  vehicleName: string,
  onTime: string,
  offTime: string,
  sumDist: string
}
export interface getLogListResponse {
  content: record[]
}