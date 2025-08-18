import { create } from "zustand";

const DEFAULT_CENTER = { lat: 36.0, lng: 128.0 };

type CarStatus = "전체" | "ACTIVE" | "INACTIVE" | "INSPECTING";

export type CarInfo = {
	latitude: number;
	longitude: number;
	status: string;
	vehicleNumber: string;
	type: string;
}

type SelectedCarStore = {
	selectedCar: CarInfo | null;
	setSelectedCar: (car: CarInfo | null) => void;
}

type CarListPageStore = {
	carListPage: boolean;
	setCarListPage: (carListPage: boolean) => void;
}

type MapStateStoreCarList = {
	mapCenterCarList: { lat: number; lng: number; };
	mapLevelCarList: number;
	setMapCenterCarList: (center: { lat: number; lng:number; }) => void;
	setMapLevelCarList: (level: number) => void;
}

type CarStatusOptionStore = {
	carStatusOption: CarStatus;
	setCarStatusOption: (selectedCarStatusOption: CarStatus) => void;
}

// carList.tsx에서 하나의 차량을 선택하였을 때 selectedCar에 해당 차량을 저장
// 선택된 selectedCar은 carList.tsx에서 fetchSelectedCarStat의 파라미터로 사용
export const useSelectCarStore = create<SelectedCarStore>((set) => ({
    selectedCar: null,
    setSelectedCar: (car) => set({ selectedCar: car})
}));

// carList.tsx에서 차량 리스트를 보여줄 지, 한 차량의 정보를 보여줄 지 결정할 때 사용
// false => 차량 리스트, true => 한 차량 정보
export const useCarListPageStore = create<CarListPageStore>((set) => ({
    carListPage: false,
    setCarListPage: (carListPage) => set({ carListPage: carListPage})
}))

// carList.tsx에서 한 차량을 클릭했을 때, 해당 차량을 확대하여 보여주는 데 사용
export const useTrackCarStore = create<MapStateStoreCarList>((set) => ({
    mapCenterCarList: DEFAULT_CENTER,
    mapLevelCarList: 12,
    setMapCenterCarList: (center) => set({mapCenterCarList: center}),
    setMapLevelCarList: (level) => set({mapLevelCarList: level})
}));

// CarList.tsx에서 전체, 운행중, 미운행, 점검중 옵션창을 클릭하여
// 지도에 클러스터링하여 표시할 때 사용
export const useCarStatusOptionStore = create<CarStatusOptionStore>((set) => ({
    carStatusOption: "전체",
    setCarStatusOption: (selectedCarStatusOption) => set({ carStatusOption: selectedCarStatusOption })
}));