import { create } from "zustand";
import { fetchMapCarLocation } from "@/Api/Map/MapCarLocation";

export type CarInfo = {
	latitude: number;
	longitude: number;
	status: string;
	vehicleNumber: string;
	type: string;
}

type AllCarLocations = {
	allCarLocations: CarInfo[];
	allCarsPolling: (cars?: string) => void;
}

type visibleCarLocations = {
    visibleCarLocations: CarInfo[];
    visibleCarsPolling: (cars?: string[]) => void;
}

// 아래는 차량이름, 번호, gps값을 담은 객체들의 배열
// carLocations안에 챠량들의 이름, 번호, gps, status값의 객체들이 들어간다.
// api/dashboard/map의 정보


// 전체 차량들 gps들
export const useAllCarLocationStore = create<AllCarLocations>((set) => ({
    allCarLocations: [],       // 여기엔 약 10초마다 전체 차량들의 gps 넣음
    
    // 아래에 cars 대신 빈 문자열
    allCarsPolling: () => {
        const getStat = () => {
            fetchMapCarLocation()
                .then(carLoc => set({allCarLocations: carLoc}))
                .catch(error => console.error(error));
        }
        getStat();
    },
}));
// React StrictMode에선 타이밍 체크용으로 두번 마운트(언마운트)했다 다시 마운트함. 
// 여러 페이지에서 각각 마운트될 때마다 useEffect 실행되면 startPolling() 여러번 실행됨.


// 화면에 보이는 차량들 gps들
export const useVisibleCarLocationStore = create<visibleCarLocations>((set) => ({
    visibleCarLocations: [],       // 여기엔 api 요청 후 화면에 보이는 차량들의 gps 값 들어감
    
    // vehicleNumbers라는 차량 번호들의 배열이 들어감
    visibleCarsPolling: (vehicleNumbers) => {
        const getStat = () => {
            fetchMapCarLocation(vehicleNumbers)
                .then(carLoc => { set({visibleCarLocations: carLoc});})
                .catch(error => console.error(error));
        }
        getStat();
    },
}));