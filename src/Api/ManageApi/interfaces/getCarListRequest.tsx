export interface getCarListRequest {
  page: number,
  sort: "vehicleNumber" | "vehicleName" | "distance" | "status"
  vehicleNumber?: string,
  status?: "active" | "inactive" | "inspecting",
}