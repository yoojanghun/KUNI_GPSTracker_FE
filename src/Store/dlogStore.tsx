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

  // 함수
  setFilter: (
    filter: { carNumber: string, startTime: string, endTime: string }
  ) => void 
  applyFilter: () => void


}

export const useDLogStore = create<DLogStore>((set, get) => ({
  DLogs: currentDLog,
  filteredDLogs: currentDLog,
  filter: { carNumber: "", startTime: "", endTime: "" },

  // 검색 조건 설정
  setFilter: (filter) => set({ filter }),

  // TODO: 날짜 입력 섹션에서 제약조건 추가, 그에 따른 ui 상호작용 구현하기
  // 필터 적용
  applyFilter: () => { 
  const { DLogs, filter } = get();
  const { carNumber, startTime, endTime } = filter;

  const filtered = DLogs.filter((DLog) => {
    const matchesNumber = DLog.carNumber.includes(carNumber);

    const startlogDate = DLog.startTime.slice(0, 10);
    const endlogDate = DLog.endTime.slice(0, 10);
    const filterStart = startTime.slice(0, 10);
    const filterEnd = endTime.slice(0, 10);
    const isTimeEmpty = !filterStart && !filterEnd; // start, end가 모두 비어있거나 모두 입력되어 있어야 함

    const matchesStart = isTimeEmpty || startlogDate >= filterStart;
    const matchesEnd = isTimeEmpty || endlogDate <= filterEnd;

    console.log('mStart: ', matchesStart);
    console.log('mEnd: ', matchesEnd);

    return matchesNumber && matchesStart && matchesEnd;
  });

  console.log('filtered: ', filtered)
  set({ filteredDLogs: filtered });
}

}))