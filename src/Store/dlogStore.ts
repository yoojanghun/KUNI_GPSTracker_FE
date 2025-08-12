import { create } from "zustand";
import type { dlog } from "@/Api/LogApi/interfaces/getLogListResponse";
import { getLogList } from "@/Api/LogApi/getLogList";

interface DLogStore {
  // 속성
  DLogs: dlog[];
  totalPage: number;
  totalElement: number;
  vehicleNumber: string;
  startTime: string;
  endTime: string;
  appliedVehicleNumber: string;
  appliedStartTime: string;
  appliedEndTime: string;
  currentPage: number;
  size: number;
  sort: "onTime,ASC" | "onTime,DESC";
  isDateValid: boolean;
  hasSearched: boolean;
  searchNonce: number;

  // 함수
  fetchDLogs: (params: {
    vehicleNumber?: string;
    startTime?: string;
    endTime?: string;
    sort?: "onTime,ASC" | "onTime,DESC";
    page?: number;
    size?: number;
  }) => Promise<void>;

  dateValidation: () => void;

  setVehicleNumber: (vehicleNumber: string) => void;
  setStartTime: (startTime: string) => void;
  setEndTime: (endTime: string) => void;
  setIsDateValid: (isValid: boolean) => void;
  setHasSearched: (hasSearched: boolean) => void;
  setSearchNonce: (searchNonce: number) => void;
  applySearch: () => void;
}

export const useDLogStore = create<DLogStore>((set, get) => ({
  DLogs: [],
  totalPage: 0,
  totalElement: 0,
  vehicleNumber: "",
  startTime: "",
  endTime: "",
  appliedVehicleNumber: "",
  appliedStartTime: "",
  appliedEndTime: "",
  currentPage: 0,
  size: 10,
  sort: "onTime,ASC",
  isDateValid: true,
  hasSearched: true,
  searchNonce: 0,

  fetchDLogs: async ({
    page = get().currentPage,
    size = get().size,
    vehicleNumber = get().appliedVehicleNumber || get().vehicleNumber,
    startTime = get().appliedStartTime || get().startTime,
    endTime = get().appliedEndTime || get().endTime,
    sort = get().sort,
  }) => {
    const adjustedStartTime = startTime
      ? new Date(`${startTime}T00:00:00+09:00`).toISOString()
      : undefined;
    const adjustedEndTime = endTime
      ? new Date(`${endTime}T23:59:59.999+09:00`).toISOString()
      : undefined;

    console.log("adjusted startTime: ", adjustedStartTime);
    console.log("adjusted endTime: ", adjustedEndTime);

    try {
      console.log("logtable size: ", size)
      const res = await getLogList({
        page,
        size,
        vehicleNumber,
        startTime: adjustedStartTime,
        endTime: adjustedEndTime,
        sort,
      });
      console.log("totalPage: ", res.totalPages);
      console.log("totalElements: ", res.totalElements);
      console.log("currentPage: ", page);
      console.log("Fetched Log Datas: ", res.content);
      set({
        DLogs: res.content,
        totalPage: res.totalPages,
        totalElement: res.totalElements,
        currentPage: page,
        size: size,
        vehicleNumber: vehicleNumber,
        startTime: startTime,
        endTime: endTime,
        appliedStartTime: startTime,
        appliedEndTime: endTime,
        appliedVehicleNumber: vehicleNumber,
        sort: sort,
      });
    } catch (err) {
      console.error("운행일지 데이터 불러오기에 실패했습니다", err);
    }
  },

  dateValidation: () => {
    const { startTime, endTime, setIsDateValid } = get();
    if (startTime === "" && endTime === "") {
      setIsDateValid(false);
      return;
    }
    if (startTime && endTime) {
      setIsDateValid(startTime <= endTime);
      return;
    }
    setIsDateValid(true);
  },

  setVehicleNumber: (vehicleNumber: string) => set({ vehicleNumber }),

  setStartTime: (startTime: string) => set({ startTime }),

  setEndTime: (endTime: string) => set({ endTime }),

  setIsDateValid: (isValid: boolean) => set({ isDateValid: isValid }),

  setHasSearched: (hasSearched: boolean) => set({ hasSearched: hasSearched}),

  setSearchNonce: (searchNonce: number) => set({ searchNonce: searchNonce}),

  applySearch: () => {
    const { vehicleNumber, startTime, endTime } = get();
    set({
      appliedVehicleNumber: vehicleNumber,
      appliedStartTime: startTime,
      appliedEndTime: endTime,
      searchNonce: Date.now(),
    });
  },
}));
