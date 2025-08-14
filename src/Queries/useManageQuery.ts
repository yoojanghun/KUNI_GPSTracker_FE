import { useQuery } from "@tanstack/react-query";
import { getCarList } from "@/Api/ManageApi/getCarList";

type UseManageParams = {
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
  searchNonce?: number;
};

export function useManageQuery(p: UseManageParams) {
  return useQuery({
    queryKey: [
      "manageCars",
      p.page,
      p.size,
      p.sort,
      p.vehicleName,
      p.status,
      p.searchNonce,
    ],
    queryFn: async () => {

      const res = await getCarList({
        page: p.page - 1,
        size: p.size,
        sort: p.sort,
        vehicleName: p.vehicleName,
        status: p.status,
      });
      return res;
    },
    enabled: true,
    placeholderData: (prev) => prev,
    staleTime: 1000 * 60 * 60,
  });
}
