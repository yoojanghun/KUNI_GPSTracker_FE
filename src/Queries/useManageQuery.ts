import { useQuery } from "@tanstack/react-query";
import { getCarList } from "@/Api/ManageApi/getCarList";
import { useRef } from "react";

export type UseManageParams = {
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
  const key = [
    "manageCars",
    p.page,
    p.size,
    p.sort,
    p.vehicleName,
    p.status,
    p.searchNonce,
  ] as const;

  // ★ 이전 키와 비교해서 무엇이 바뀌는지 찍기
  const prevKeyRef = useRef<typeof key | null>(null);
  if (prevKeyRef.current) {
    const prev = prevKeyRef.current;
    const diff = {
      page: [prev[1], key[1]],
      size: [prev[2], key[2]],
      sort: [prev[3], key[3]],
      vehicleName: [prev[4], key[4]],
      status: [prev[5], key[5]],
      searchNonce: [prev[6], key[6]],
      changed: prev.some((v, i) => v !== key[i]),
    };
    // 체크박스 토글 시 여기서 무엇이 바뀌는지 바로 보임
    console.log("[useManageQuery key diff]", diff);
  }
  prevKeyRef.current = key;

  return useQuery({
    queryKey: key,
    queryFn: async () => {
      console.log("[useManageQuery fetch start]", {
        page: p.page, size: p.size, sort: p.sort,
        vehicleName: p.vehicleName, status: p.status, searchNonce: p.searchNonce,
      });
      const res = await getCarList({
        page: p.page-1,
        size: p.size,
        sort: p.sort,
        vehicleName: p.vehicleName,
        status: p.status,
      });
      console.log("[useManageQuery fetch done]", res);
      return res;
    },
    enabled: true,
    placeholderData: (prev) => prev,
    staleTime: 1000 * 60 * 60,
    // 필요시 임시로 포커스/마운트 리패치 방지
    // refetchOnWindowFocus: false,
    // refetchOnMount: false,
  });
}
