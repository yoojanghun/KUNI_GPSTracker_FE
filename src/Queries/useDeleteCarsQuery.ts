import { useMutation, useQueryClient } from "@tanstack/react-query";
import { carDelete, carDeleteMany } from "@/Api/ManageApi/carDelete";
import { useCarStore } from "@/Store/carStore";
import type { carList } from "@/Api/ManageApi/interfaces/getCarListResponse";

// 단건 삭제
export function useDeleteCarMutation() {
  const queryClient = useQueryClient();
  const { appliedVehicleName, appliedStatus, appliedSort, appliedPage, size, searchNonce, selected, setSelected } =
    useCarStore();

  // 현재 화면의 쿼리키를 직접 구성
  const queryKey = [
    "cars",
    appliedVehicleName,
    appliedStatus,
    appliedSort,
    appliedPage,
    size,
    searchNonce,
  ];

  return useMutation({
    mutationFn: async (carNumber: string) => {
      await carDelete({ vehicleNumber: carNumber });
      return carNumber;
    },
    onMutate: async (carNumber) => {
      await queryClient.cancelQueries({ queryKey });

      const previous = queryClient.getQueryData<carList[]>(queryKey);

      // 낙관적 업데이트
      if (previous) {
        const next = previous.filter((c) => c.carNumber !== carNumber);
        queryClient.setQueryData(queryKey, next);
      }

      // 선택 상태에서 제거
      const nextSelected = new Set(selected);
      nextSelected.delete(carNumber);
      setSelected(Array.from(nextSelected));

      return { previous, key: queryKey as readonly unknown[] };
    },
    onError: (_err, _vars, ctx) => {
      // 롤백
      if (ctx?.previous && ctx?.key) {
        queryClient.setQueryData(ctx.key, ctx.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["cars"], exact: false });
    },
  });
}

// 다건 삭제
export function useDeleteManyCarsMutation() {
  const queryClient = useQueryClient();
  const { appliedVehicleName, appliedStatus, appliedSort, appliedPage, size, searchNonce, selected, setSelected } =
    useCarStore();

  const queryKey = [
    "cars",
    appliedVehicleName,
    appliedStatus,
    appliedSort,
    appliedPage,
    size,
    searchNonce,
  ];

  return useMutation({
    mutationFn: async (carNumbers: string[]) => {
      await carDeleteMany(carNumbers);
      return carNumbers;
    },
    onMutate: async (carNumbers) => {
      await queryClient.cancelQueries({ queryKey });

      const previous = queryClient.getQueryData<carList[]>(queryKey);

      // 낙관적 업데이트
      if (previous) {
        const removeSet = new Set(carNumbers);
        const next = previous.filter((c) => !removeSet.has(c.carNumber));
        queryClient.setQueryData(queryKey, next);
      }

      // 선택 상태는 여기선 유지 (실패 시 체크박스 해제 안 함)
      return { previous, key: queryKey as readonly unknown[] };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous && ctx?.key) {
        queryClient.setQueryData(ctx.key, ctx.previous);
      }
    },
    onSuccess: (carNumbers) => {
      // 전체 성공 시에만 선택에서 제거
      const nextSelected = new Set(selected);
      carNumbers.forEach((n) => nextSelected.delete(n));
      setSelected(Array.from(nextSelected));
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["cars"], exact: false });
    },
  });
}