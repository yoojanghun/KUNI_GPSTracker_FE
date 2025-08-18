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

type SelectedCarLatLng = {
	carNumber: string | null;
	latLng: {latitude: number | null; longitude: number | null};
	setCarNumber: (carNum: string) => void;
	setLatLng: (markerPos: {latitude: number; longitude: number}) => void;
	clearSetLatLng: () => void;
}

// carList.tsx에서 하나의 차량을 선택하였을 때 selectedCar에 해당 차량을 저장
// 선택된 selectedCar은 carList.tsx에서 fetchSelectedCarStat의 파라미터로 사용
export const useSelectCarStore = create<SelectedCarStore>((set) => ({
    selectedCar: null,
    setSelectedCar: (car) => set({ selectedCar: car})
}));

// CarList.tsx에서 하나의 차량을 선택 => carList.tsx에서 api를 통해 해당 차량 정보 획득
// 그 정보 내엔 lat, lng값이 존재하는데, 그 값을 zustand에 저장하여 다른 파일에도 사용할 수 있도록
export const useSelectedCarLatLng = create<SelectedCarLatLng>((set) => ({
    carNumber: null,
    latLng: {latitude: null, longitude: null},
    setCarNumber: (carNum) => set({carNumber: carNum}),
    setLatLng: (pos) => set({latLng: {latitude: pos.latitude, longitude: pos.longitude}}),
    clearSetLatLng: () => set({latLng: {latitude: null, longitude: null}})
}))

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