export interface getCarListRequest {
  page: number;
  size: number;
  sort?:
    "createDate,ASC"
    | "createDate,DESC"
    | "carNumber,ASC"
    | "carNumber,DESC"
    | "type,ASC"
    | "type,DESC"
    | "totalDist,ASC"
    | "totalDist,DESC"
    | "status,ASC"
    | "status,DESC";
  vehicleName?: string;
  status?: "" | "ACTIVE" | "INACTIVE" | "INSPECTING";
}
