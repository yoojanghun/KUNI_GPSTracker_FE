import { create } from "zustand";
import type { carList } from "@/Api/ManageApi/interfaces/getCarListResponse";
import type { getCarListRequest } from "@/Api/ManageApi/interfaces/getCarListRequest";

interface CarStoreState {
  // 검색 확정값(검색 버튼으로 잠근 값)
  appliedVehicleName: string;
  appliedStatus: getCarListRequest["status"];
  appliedSort: getCarListRequest["sort"];
  appliedPage: number;
  // 검색 트리거(필요 시 쿼리 훅 무효화/리프레시 용)
  searchNonce: number;

  cars: carList[];
  vehicleName: string;
  status: getCarListRequest["status"];
  totalPage: number;
  totalElement: number;
  currentPage: number;
  size: number;
  sort: getCarListRequest["sort"];

  selected: Set<string>;
  isAllSelected: () => boolean;
  toggleSelectAll: () => void;
  setSelected: (ids: string[]) => void;
  setVehicleName: (vehicleName: string) => void;
  setStatus: (currentStatus: getCarListRequest["status"]) => void;
  clearSelected: () => void;

  setCars: (cars: carList[]) => void;
  setTotalPage: (n: number) => void;
  setTotalElement: (n: number) => void;

  // 현재 입력된 값들을 확정(search 적용)
  applySearch: () => void;
}

export const useCarStore = create<CarStoreState>((set, get) => ({
  // 검색 확정값(검색 버튼으로 잠근 값)
  appliedVehicleName: "",
  appliedStatus: "" as getCarListRequest["status"],
  appliedSort: "createDate,DESC" as getCarListRequest["sort"],
  appliedPage: 1,
  // 검색 트리거(필요 시 쿼리 훅 무효화/리프레시 용)
  searchNonce: 0,

  cars: [],
  vehicleName: "",
  status: "" as getCarListRequest["status"],
  totalPage: 0,
  totalElement: 0,
  currentPage: 0,
  size: 10,
  sort: "createDate,DESC" as getCarListRequest["sort"],

  selected: new Set(),

  setCars: (cars) => set({ cars }),
  setTotalPage: (n) => set({ totalPage: n }),
  setTotalElement: (n) => set({ totalElement: n }),

  setVehicleName: (vehicleName) => {
    console.log("vehicleName set: ", vehicleName);
    set({ vehicleName: vehicleName });
  },

  setStatus: (currentStatus: getCarListRequest["status"]) => {
    console.log("status set: ", currentStatus);
    set({ status: currentStatus });
  },

  isAllSelected: () => {
    const { selected, cars } = get();
    return cars.length > 0 && selected.size === cars.length;
  },

  toggleSelectAll: () => {
    const { cars, selected } = get();
    if (selected.size === cars.length) {
      set({ selected: new Set() });
    } else {
      set({ selected: new Set(cars.map((car) => car.carNumber)) });
    }
  },

  setSelected: (ids) => {
    console.log('[store] setSelected', { len: ids.length });
    set({ selected: new Set(ids) })
  },

  clearSelected: () => set({ selected: new Set() }),

  // 현재 입력된 값들을 확정(search 적용)
  // 검색 버튼 등에서 호출하여 입력값(vehicleName, status, sort, page)을 확정값(applied*)에 저장
  applySearch: () => {
    const { vehicleName, status, sort, currentPage } = get();
    set({
      appliedVehicleName: vehicleName,
      appliedStatus: status,
      appliedSort: sort,
      appliedPage: currentPage || 1,
      // 검색 트리거 증가(필요 시 쿼리 무효화/리프레시 용)
      searchNonce: Date.now(),
    });
  },
  
}));
