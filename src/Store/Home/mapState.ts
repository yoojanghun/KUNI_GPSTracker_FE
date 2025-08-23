import { create } from "zustand";

const DEFAULT_CENTER = { lat: 36.0, lng: 128.0 };

type CarStatus = "전체" | "ACTIVE" | "INACTIVE" | "INSPECTING";

type CarStatusBtnStore = {
	carStatusBtn: CarStatus;
	setCarStatusBtn: (selectedCarStatusBtn: CarStatus) => void;
}

type HomeMapStateStore = {
	homeMapCenter: { lat: number; lng: number; };
	homeMapLevel: number;
	setHomeMapCenter: (center: { lat: number; lng: number }) => void;
	setHomeMapLevel: (level: number) => void;
}

// Home.tsx에서 전체, 운행중, 미운행, 점검중 체크박스를 클릭하여 
// 지도에 클러스터링하여 표시할 때 사용
export const useCarStatusBtnStore = create<CarStatusBtnStore>((set) => ({
    carStatusBtn: "전체",
    setCarStatusBtn: (selectedCarStatusBtn) => set({carStatusBtn: selectedCarStatusBtn})
}));

// Home.tsx에서 지도를 확대/축소 및 중심이동하였을 때, 다른 페이지로 이동한 후 다시 돌아와도
// 원래 이전 지도의 모습을 유지하도록 할 때 사용
export const useHomeMapStore = create<HomeMapStateStore>((set) => ({
    homeMapCenter: DEFAULT_CENTER,
    homeMapLevel: 13,
    setHomeMapCenter: (center) => set({homeMapCenter: center}),
    setHomeMapLevel: (level) => set({homeMapLevel: level})
}));