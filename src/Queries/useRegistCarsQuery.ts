import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCarStore } from "@/Store/carStore";
import { carRegist } from "@/Api/ManageApi/carRegist";
import type { getCarListResponse, carList } from "@/Api/ManageApi/interfaces/getCarListResponse";
import type { carRegistRequest } from "@/Api/ManageApi/interfaces/carRegistRequest";

// 단건 삭제
export function useRegistCarMutation() {
  const queryClient = useQueryClient();
  const { appliedVehicleName, appliedStatus, appliedSort, appliedPage, size, searchNonce } =
    useCarStore();

  // 현재 화면의 쿼리키 (useManageQuery와 완전히 동일한 구성)
  const queryKey = [
    "manageCars",
    appliedPage,
    size,
    appliedSort,
    appliedVehicleName,
    appliedStatus,
    searchNonce,
  ] as const;

  return useMutation({
    mutationFn: async ({ vehicleNumber, vehicleName }: carRegistRequest) => {
      await carRegist({ vehicleNumber: vehicleNumber, vehicleName: vehicleName });
      return {vehicleNumber, vehicleName};
    },
    onMutate: async ({ vehicleNumber, vehicleName }: carRegistRequest) => {
      await queryClient.cancelQueries({ queryKey });

      const previous = queryClient.getQueryData<getCarListResponse>(queryKey);

      // 낙관적 업데이트 (페이지 응답 형태 유지, 불변성 보장)
      if (previous) {
        const newItem: carList = {
          carNumber: vehicleNumber,
          type: vehicleName,
          status: "INACTIVE",
          totalDist: 0,
        };
        const next: getCarListResponse = {
          ...previous,
          content: [newItem, ...previous.content],
          totalElements: previous.totalElements + 1,
        };
        queryClient.setQueryData(queryKey, next);
      }


      // 롤백용으로 이전 데이터 반환
      return { previous, key: queryKey as readonly unknown[] };
    },
    onError: (_err, _vars, ctx) => {
      // 롤백
      if (ctx?.previous && ctx?.key) {
        queryClient.setQueryData(ctx.key, ctx.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["manageCars"], exact: false });
    },
  });
}