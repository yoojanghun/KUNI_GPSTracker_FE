import { create } from "zustand";

export type Position = {
    lat: number;
    lng: number;
    time: number;
}

export type CarInfo = {
    number: string;
    name: string;
    mileage: number;
    status: string;
    path?: Position[];
}

type SelectedCarStore = {
    selectedCar: CarInfo | null;
    setSelectedCar: (car: CarInfo | null) => void;
}

type CarStatusBtnStore = {
    carStatusBtn: string;
    setCarStatusBtn: (selectedCarStatusBtn: string) => void;
}

type CarStatusOptionStore = {
    carStatusOption: string;
    setCarStatusOption: (selectedCarStatusOption: string) => void;
}

const DEFAULT_CENTER = { lat: 36.0, lng: 128.0 };

type PaginationStore = {
    page: number;
    setPage: (page: number) => void;
}

type LocationSearchMapStateStore = {
    locationSearchMapCenter: { lat: number; lng: number; };
    locationSearchMapLevel: number;
    setLocationSearchMapCenter: (center: { lat: number; lng:number; }) => void;
    setLocationSearchMapLevel: (level: number) => void;
}

type HomeMapStateStore = {
    homeMapCenter: { lat: number; lng: number; };
    homeMapLevel: number;
    setHomeMapCenter: (center: { lat: number; lng: number }) => void;
    setHomeMapLevel: (level: number) => void;
}

type MapStateStoreCarList = {
    mapCenterCarList: { lat: number; lng: number; };
    mapLevelCarList: number;
    setMapCenterCarList: (center: { lat: number; lng:number; }) => void;
    setMapLevelCarList: (level: number) => void;
}

// carList에서 하나의 차량을 선택하였을 때 selectedCar에 해당 차량을 저장
// selectedCar에 저장된 차량이 있으면 carList에서 차량 정보 표시
export const useSelectCarStore = create<SelectedCarStore>((set) => ({
    selectedCar: null,
    setSelectedCar: (car) => set({ selectedCar: car})
}));

// Home.tsx에서 전체, 운행중, 미운행, 점검중 체크박스를 클릭하여 
// 지도에 클러스터링하여 표시할 때 사용
export const useCarStatusBtnStore = create<CarStatusBtnStore>((set) => ({
    carStatusBtn: "전체",
    setCarStatusBtn: (selectedCarStatusBtn) => set({carStatusBtn: selectedCarStatusBtn})
}))

// CarList.tsx에서 전체, 운행중, 미운행, 점검중 옵션창을 클릭하여
// 지도에 클러스터링하여 표시할 때 사용
export const useCarStatusOptionStore = create<CarStatusOptionStore>((set) => ({
    carStatusOption: "전체",
    setCarStatusOption: (selectedCarStatusOption) => set({ carStatusOption: selectedCarStatusOption })
}));

// CarList.tsx에서 pagination하는 데 사용
export const usePaginationStore = create<PaginationStore>((set) => ({
    page: 1,
    setPage: (page) => set({page: page})
}))

// LocationSearch.tsx에서 지도를 확대/축소 및 중심이동하였을 때, 다른 페이지로 이동한 후 다시 돌아와도
// 원래 이전 지도의 모습을 유지하도록 할 때 사용
export const useLocationSearchMapStore = create<LocationSearchMapStateStore>((set) => ({
    locationSearchMapCenter: DEFAULT_CENTER,
    locationSearchMapLevel: 13,
    setLocationSearchMapCenter: (center) => set({locationSearchMapCenter: center}),
    setLocationSearchMapLevel: (level) => set({locationSearchMapLevel: level})
}));

// Home.tsx에서 지도를 확대/축소 및 중심이동하였을 때, 다른 페이지로 이동한 후 다시 돌아와도
// 원래 이전 지도의 모습을 유지하도록 할 때 사용
export const useHomeMapStore = create<HomeMapStateStore>((set) => ({
    homeMapCenter: DEFAULT_CENTER,
    homeMapLevel: 12,
    setHomeMapCenter: (center) => set({homeMapCenter: center}),
    setHomeMapLevel: (level) => set({homeMapLevel: level})
}))

// carList에서 한 차량을 클릭했을 때, 해당 차량을 확대하여 보여주는 데 사용
export const useTrackCarStore = create<MapStateStoreCarList>((set) => ({
    mapCenterCarList: DEFAULT_CENTER,
    mapLevelCarList: 12,
    setMapCenterCarList: (center) => set({mapCenterCarList: center}),
    setMapLevelCarList: (level) => set({mapLevelCarList: level})
}));