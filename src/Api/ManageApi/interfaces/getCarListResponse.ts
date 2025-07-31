

interface carList {
  carNumber: string,
  carName: string,
  status: "active" | "inactive" | "inspecting",
  drivingDistanceKm: number
}

export interface getCarListResponse {
  carLists: carList[]
}