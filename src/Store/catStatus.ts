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

type carStatusOptionStore = {
    carStatusOption: string;
    setCarStatusOption: (selectedCarStatusOption: string) => void;
}

export const useSelectCarStore = create<SelectedCarStore>((set) => ({
    selectedCar: null,
    setSelectedCar: (car) => set({ selectedCar: car})
}));

export const useCarStatusOptionStore = create<carStatusOptionStore>((set) => ({
    carStatusOption: "전체",
    setCarStatusOption: (selectedCarStatusOption) => set({ carStatusOption: selectedCarStatusOption })
}));