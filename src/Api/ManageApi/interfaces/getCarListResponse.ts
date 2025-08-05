export interface carList {
  carNumber: string,
  type: string,
  status: "ACTIVE" | "INACTIVE" | "INSPECTING",
  totalDist: number
}

export interface getCarListResponse {
  totalPages: number,
  totalElements: number,
  content: carList[]
}