import { useMutation, useQueryClient } from "@tanstack/react-query";
import { carDelete, carDeleteMany } from "@/Api/ManageApi/carDelete";
import { useCarStore } from "@/Store/carStore";
import type { carList, getCarListResponse } from "@/Api/ManageApi/interfaces/getCarListResponse";

// 단건 삭제
export function useDeleteCarMutation() {
  const queryClient = useQueryClient();
  const { appliedVehicleName, appliedStatus, appliedSort, appliedPage, size, searchNonce, selected, setSelected } =
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
    mutationFn: async (carNumber: string) => {
      await carDelete({ vehicleNumber: carNumber });
      return carNumber;
    },
    onMutate: async (carNumber) => {
      await queryClient.cancelQueries({ queryKey });

      const previous = queryClient.getQueryData<getCarListResponse>(queryKey);

      // 낙관적 업데이트 (페이지 응답 형태 유지)
      if (previous) {
        const nextContent = previous.content.filter((c: carList) => c.carNumber !== carNumber);
        const next: getCarListResponse = {
          ...previous,
          content: nextContent,
          totalElements: Math.max(0, previous.totalElements - 1),
        };
        queryClient.setQueryData(queryKey, next);
      }

      // 선택 상태에서 제거
      const nextSelected = new Set(selected);
      nextSelected.delete(carNumber);
      setSelected(Array.from(nextSelected));

      // 롤백용으로 이전 데이터 반환
      return { previous, key: queryKey as readonly unknown[] };
    },
    onError: (_err, _vars, ctx) => {
      // 롤백
      if (ctx?.previous && ctx?.key) {
        queryClient.setQueryData(ctx.key, ctx.previous);
      }
      // 선택 상태 복구
      const restored = new Set(selected);
      if (typeof _vars === 'string') {
        restored.add(_vars);
      }
      setSelected(Array.from(restored));
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["manageCars"], exact: false });
    },
  });
}

// 다건 삭제
export function useDeleteManyCarsMutation() {
  const queryClient = useQueryClient();
  const { appliedVehicleName, appliedStatus, appliedSort, appliedPage, size, searchNonce, selected, setSelected } =
    useCarStore();

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
    mutationFn: async (carNumbers: string[]) => {
      await carDeleteMany(carNumbers);
      return carNumbers;
    },
    onMutate: async (carNumbers) => {
      await queryClient.cancelQueries({ queryKey });

      const previous = queryClient.getQueryData<getCarListResponse>(queryKey);

      // 낙관적 업데이트 (페이지 응답 형태 유지)
      if (previous) {
        const removeSet = new Set(carNumbers);
        const nextContent = previous.content.filter((c: carList) => !removeSet.has(c.carNumber));
        const removedCount = previous.content.length - nextContent.length;
        const next: getCarListResponse = {
          ...previous,
          content: nextContent,
          totalElements: Math.max(0, previous.totalElements - removedCount),
        };
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
      queryClient.invalidateQueries({ queryKey: ["manageCars"], exact: false });
    },
  });
}