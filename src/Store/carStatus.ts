import { type MapCarLocation, fetchMapCarLocation } from "@/Api/Map/MapCarLocation";
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

type CarListPageStore = {
	carListPage: boolean;
	setCarListPage: (carListPage: boolean) => void;
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

type CarLocations = {
	carLocations: MapCarLocation;
	startPolling: (status?: string) => void;
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

// Home.tsx에서 전체, 운행중, 미운행, 점검중 체크박스를 클릭하여 
// 지도에 클러스터링하여 표시할 때 사용
export const useCarStatusBtnStore = create<CarStatusBtnStore>((set) => ({
	carStatusBtn: "전체",
	setCarStatusBtn: (selectedCarStatusBtn) => set({carStatusBtn: selectedCarStatusBtn})
}));

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
	homeMapLevel: 13,
	setHomeMapCenter: (center) => set({homeMapCenter: center}),
	setHomeMapLevel: (level) => set({homeMapLevel: level})
}));

// 아래는 차량이름, 번호, gps값을 담은 객체들의 배열
// carLocations안에 챠량들의 이름, 번호, gps, status값의 객체들이 들어간다.
// api/dashboard/map의 정보

let pollingStarted = false;		

export const useMapCarLocationStore = create<CarLocations>((set) => ({
	carLocations: [],
	
	startPolling: (status) => {
		if(pollingStarted) return;
		pollingStarted = true;			// true일 때는 pollingStarted 못하도록
		const getStat = () => {
			fetchMapCarLocation(status)
				.then(carLoc => set({carLocations: carLoc}))
				.catch(error => console.error(error))
		}
		getStat();
		setInterval(getStat, 60_000);
	}
}))
// React StrictMode에선 타이밍 체크용으로 두번 마운트(언마운트)했다 다시 마운트함. 
// 여러 페이지에서 각각 마운트될 때마다 useEffect 실행되면 startPolling() 여러번 실행됨.

// CarList.tsx에서 하나의 차량을 선택 => carList.tsx에서 api를 통해 해당 차량 정보 획득
// 그 정보 내엔 lat, lng값이 존재하는데, 그 값을 zustand에 저장하여 다른 파일에도 사용할 수 있도록
export const useSelectedCarLatLng = create<SelectedCarLatLng>((set) => ({
	carNumber: null,
	latLng: {latitude: null, longitude: null},
	setCarNumber: (carNum) => set({carNumber: carNum}),
	setLatLng: (pos) => set({latLng: {latitude: pos.latitude, longitude: pos.longitude}}),
	clearSetLatLng: () => set({latLng: {latitude: null, longitude: null}})
}))