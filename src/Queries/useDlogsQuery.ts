import { useQuery } from "@tanstack/react-query";
import { getLogList } from "@/Api/LogApi/getLogList";

type UseDlogsParams = {
  page: number;
  size: number;
  sort?: "onTime,ASC" | "onTime,DESC";
  vehicleNumber?: string;
  startTime?: string;
  endTime?: string;
  enabled?: boolean;
  searchNonce?: number;
};

export function useDlogsQuery(p: UseDlogsParams) {
  return useQuery({
    queryKey: [
      "dlogs",
      p.page,
      p.size,
      p.sort,
      p.vehicleNumber,
      p.startTime,
      p.endTime,
      p.searchNonce,
    ],
    queryFn: async () => {

      const res = await getLogList({
        page: p.page - 1,
        size: p.size,
        sort: p.sort,
        vehicleNumber: p.vehicleNumber,
        startTime: p.startTime ? p.startTime+"T00:00:00" : "",
        endTime: p.endTime ? p.endTime+"T23:59:59" : "",
      });
      return res;
    },
    enabled: p.enabled ?? true,
    placeholderData: (prev) => prev,
  });
}
