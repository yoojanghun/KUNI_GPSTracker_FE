import { create } from "zustand";
import type { dlog } from "@/Api/LogApi/interfaces/getLogListResponse";

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
