import { create } from "zustand";
import { getCarList } from "@/Api/ManageApi/getCarList";
import type { carList } from "@/Api/ManageApi/interfaces/getCarListResponse";
import type { getCarListRequest } from "@/Api/ManageApi/interfaces/getCarListRequest";

interface CarStoreState {
  cars: carList[];
  vehicleNumber: string;
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
  setVehicleNumber: (vehicleNumber: string) => void;
  setStatus: (currentStatus: getCarListRequest["status"]) => void;
  clearSelected: () => void;

  fetchCars: (params: {
    page?: number;
    size?: number;
    sort?: getCarListRequest["sort"];
    vehicleNumber?: string;
    status?: getCarListRequest["status"];
  }) => Promise<void>;
}

export const useCarStore = create<CarStoreState>((set, get) => ({
  cars: [],
  vehicleNumber: "",
  status: "" as getCarListRequest["status"],
  totalPage: 0,
  totalElement: 0,
  currentPage: 0,
  size: 10,
  sort: "createDate,ASC" as getCarListRequest["sort"],

  selected: new Set(),

  setVehicleNumber: (vehicleNumber) => {
    console.log("vehicleNumber set: ", vehicleNumber);
    set({ vehicleNumber: vehicleNumber });
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

  setSelected: (ids) => set({ selected: new Set(ids) }),

  clearSelected: () => set({ selected: new Set() }),

  fetchCars: async ({
    page = get().currentPage,
    size = get().size,
    sort = get().sort,
    vehicleNumber = get().vehicleNumber,
    status = get().status,
  }) => {
    try {
      const res = await getCarList({ page, size, sort, vehicleNumber, status });
      console.log("total Pages: ", res.totalPages);
      console.log("total Elements: ", res.totalElements);
      set({
        cars: res.content,
        totalPage: res.totalPages,
        totalElement: res.totalElements,
        currentPage: page,
        size: size,
        sort: sort,
      });
    } catch (err) {
      console.error("차량 데이터 불러오기에 실패했습니다", err);
    }
  },
}));
