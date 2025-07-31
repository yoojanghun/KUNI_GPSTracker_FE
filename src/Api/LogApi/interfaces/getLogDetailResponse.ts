interface recordDetail {
  time: string,
  lat: number,
  lng: number
}
export interface getLogDetailResponse {
  vehicleNumber: string,
  vehicleName: string,
  onTime: string,
  offTime: string,
  sumDist: string,
  startLat: number,
  startLng: number,
  endLat: number,
  endLng: number,
  record: recordDetail[]
}