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

type CarStatusOptionStore = {
    carStatusOption: string;
    setCarStatusOption: (selectedCarStatusOption: string) => void;
}

type MapState = {
    mapCenter: { lat: number; lng: number; };
    mapLevel: number;
    setMapCenter: (center: { lat: number; lng:number; }) => void;
    setMapLevel: (level: number) => void;
}

// carList에서 하나의 차량을 선택하였을 때 selectedCar에 해당 차량을 저장
// selectedCar에 저장된 차량이 있으면 carList에서 차량 정보 표시
export const useSelectCarStore = create<SelectedCarStore>((set) => ({
    selectedCar: null,
    setSelectedCar: (car) => set({ selectedCar: car})
}));

// Home.tsx와 CarList.tsx에서 전체, 운행중, 미운행, 점검중 체크박스 또는 옵션창을 클릭하여
// 지도에 클러스터링하여 표시할 때 사용
export const useCarStatusOptionStore = create<CarStatusOptionStore>((set) => ({
    carStatusOption: "전체",
    setCarStatusOption: (selectedCarStatusOption) => set({ carStatusOption: selectedCarStatusOption })
}));

// 지도를 확대/축소 및 중심이동하였을 때, 다른 페이지로 이동한 후 다시 돌아와도
// 원래 이전 지도의 모습을 유지하도록 할 때 사용
// carList에서 한 차량을 클릭했을 때, 해당 차량을 확대하여 보여주는 데도 사용
export const useMapStore = create<MapState>((set) => ({
    mapCenter: { lat: 37.5660, lng: 126.9775},
    mapLevel: 13,
    setMapCenter: (center) => set({mapCenter: center}),
    setMapLevel: (level) => set({mapLevel: level})
}));