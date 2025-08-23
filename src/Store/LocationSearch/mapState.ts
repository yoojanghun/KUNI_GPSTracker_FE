import { create } from "zustand";

const DEFAULT_CENTER = { lat: 36.0, lng: 128.0 };

type LocationSearchMapStateStore = {
	locationSearchMapCenter: { lat: number; lng: number; };
	locationSearchMapLevel: number;
	setLocationSearchMapCenter: (center: { lat: number; lng:number; }) => void;
	setLocationSearchMapLevel: (level: number) => void;
}

// LocationSearch.tsx에서 지도를 확대/축소 및 중심이동하였을 때, 다른 페이지로 이동한 후 다시 돌아와도
// 원래 이전 지도의 모습을 유지하도록 할 때 사용
export const useLocationSearchMapStore = create<LocationSearchMapStateStore>((set) => ({
    locationSearchMapCenter: DEFAULT_CENTER,
    locationSearchMapLevel: 13,
    setLocationSearchMapCenter: (center) => set({locationSearchMapCenter: center}),
    setLocationSearchMapLevel: (level) => set({locationSearchMapLevel: level})
}));