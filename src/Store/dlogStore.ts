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
  currentPage: number;
  size: number;
  sort: "asc" | "desc";
  isDateValid: boolean;

  // 함수
  fetchDLogs: (params: {
    vehicleNumber?: string;
    startTime?: string;
    endTime?: string;
    sort?: "asc" | "desc";
    page?: number;
    size?: number;
  }) => Promise<void>;

  dateValidation: () => void;

  setVehicleNumber: (vehicleNumber: string) => void;
  setStartTime: (startTime: string) => void;
  setEndTime: (endTime: string) => void;
  setIsDateValid: (isValid: boolean) => void;
}

export const useDLogStore = create<DLogStore>((set, get) => ({
  DLogs: [],
  totalPage: 0,
  totalElement: 0,
  vehicleNumber: "",
  startTime: "",
  endTime: "",
  currentPage: 0,
  size: 10,
  sort: "asc",
  isDateValid: true,

  fetchDLogs: async ({
    page = get().currentPage,
    size = get().size,
    vehicleNumber = get().vehicleNumber,
    startTime = get().startTime,
    endTime = get().endTime,
    sort = get().sort,
  }) => {
    const adjustedEndTime = endTime
      ? new Date(new Date(endTime).setDate(new Date(endTime).getDate() + 1)).toISOString()
      : undefined;
    try {
      const res = await getLogList({
        page,
        size,
        vehicleNumber,
        startTime,
        endTime: adjustedEndTime,
        sort,
      });
      set({
        DLogs: res.content,
        totalPage: res.totalPage,
        totalElement: res.totalElements,
        currentPage: page,
        size: size,
        vehicleNumber: vehicleNumber,
        startTime: startTime,
        endTime: endTime,
        sort: sort,
      });
    } catch (err) {
      console.error("운행일지 데이터 불러오기에 실패했습니다", err);
    }
  },

  dateValidation: () => {
    const { startTime, endTime, setIsDateValid } = get();
    const start = new Date(startTime);
    const end = new Date(endTime);

    if (
      start.getTime() > end.getTime() ||
      (startTime === "" && endTime === "")
    ) {
      setIsDateValid(false);
    } else {
      setIsDateValid(true);
    }
  },

  setVehicleNumber: (vehicleNumber: string) => set({ vehicleNumber }),

  setStartTime: (startTime: string) => set({ startTime }),

  setEndTime: (endTime: string) => set({ endTime }),

  setIsDateValid: (isValid: boolean) => set({ isDateValid: isValid }),
}));
