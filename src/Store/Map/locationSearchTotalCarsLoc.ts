import { create } from "zustand";
import { fetchMapCarLocation } from "@/Api/Map/MapCarLocation";

export type Position = {
	lat: number;
	lng: number;
	time: number;
}

export type CarInfo = {
	latitude: number;
	longitude: number;
	status: string;
	vehicleNumber: string;
	type: string;
}

type CarLocations = {
	carLocations: CarInfo[];
	startPolling: (status?: string) => void;
}

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