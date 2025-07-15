import { create } from "zustand";
import { currentDLog } from "@/Api/currentDLog";

interface DLog {
  carNumber: string,
  carName: string,
  startTime: string,
  endTime: string,
  distance: number,
  driver: string
}

interface DLogStore {
  // 속성
  DLogs: DLog[];
  filteredDLogs: DLog[];
  filter: { carNumber: string, startTime: string, endTime: string }
  isDateValid: boolean

  // 함수
  setFilter: (
    filter: { carNumber: string, startTime: string, endTime: string }
  ) => void 
  setIsDateValid: ( valid:boolean ) => void
  applyFilter: () => void
}

export const useDLogStore = create<DLogStore>((set, get) => ({
  DLogs: currentDLog,
  filteredDLogs: currentDLog,
  filter: { carNumber: "", startTime: "", endTime: "" },
  isDateValid: true,

  // 검색 조건 설정
  setFilter: (filter) => set({ filter }),

  setIsDateValid: (valid) => set({ isDateValid: valid }),

  // TODO: 날짜 입력 섹션에서 제약조건 추가, 그에 따른 ui 상호작용 구현하기
  // 필터 적용
  applyFilter: () => { 
  const { DLogs, filter } = get();
  const { carNumber, startTime, endTime } = filter;
  const filterStart = startTime.slice(0, 10);
  const filterEnd = endTime.slice(0, 10);
  const isTimeValid = (!filterStart && !filterEnd) || (!!filterStart && !!filterEnd);
  let count = 0;

  const filtered = DLogs.filter((DLog) => {
    const matchesNumber = DLog.carNumber.includes(carNumber);

    const startlogDate = DLog.startTime.slice(0, 10);
    const endlogDate = DLog.endTime.slice(0, 10);
    

    const matchesStart = filterStart !== "" ? startlogDate >= filterStart : true;
    const matchesEnd = filterEnd !== "" ? endlogDate <= filterEnd : true;

    console.log("CarNum: ", DLog.carNumber);
    console.log("start: ",startTime);
    console.log("end: ", endTime);
    console.log("mStart: ", matchesStart);
    console.log("mEnd: ", matchesEnd);
    console.log("count: ", count);
    count++;

    if (carNumber === "") {
      return matchesStart && matchesEnd;
    }

    return matchesNumber && matchesStart && matchesEnd;
  });

  set({ filteredDLogs: filtered });
  set({ isDateValid: isTimeValid });
},
}))