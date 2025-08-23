// carList.tsx(위치 조회 페이지의 리스트)에서 차량 리스트를 가져와 
// pagination하는데 사용하는 코드
import { api } from "../index";
import { create } from "zustand";

export interface Car {
  carNumber: string;
    type: string;   
    status: string;
    totalDist: number;
}
export interface Sort {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
}
export interface Pageable {
    pageNumber: number;
    pageSize: number;
    sort: Sort;
    offset: number;
    paged: boolean;
    unpaged: boolean;
}
export interface TotalCarsList {
    content: Car[];
    pageable: Pageable;
    totalPages: number;
    totalElements: number;
    last: boolean;
    size: number;
    number: number;
    sort: Sort;
    numberOfElements: number;
    first: boolean;
    empty: boolean;
}

type SearchedCar = {
    searchedCar: string | null;
    setSearchedCar: (car: string) => void;
}

// /api/vehicle (차량 목록 조회)
export async function fetchTotalCarsList(
    page: number = 0, 
    size: number = 7, 
    vehicleName: string | null,
    status: string = ""
): Promise<TotalCarsList> {
    const params: Record<string, string | number> = {
        page,
        size,
        status
    }   
    if(vehicleName) {
        params.vehicleName = vehicleName;
    }
    if(status === "전체") {
        params.status = "";
    }
    const stats = await api.get("api/vehicle",
        {searchParams: params}
    ).json<TotalCarsList>();

    return stats;
}

// carList.tsx에서 검색된 차량을 저장
export const useSearchedCar = create<SearchedCar>((set) => ({
    searchedCar: null,
    setSearchedCar: (car) => set({searchedCar: car})
}))