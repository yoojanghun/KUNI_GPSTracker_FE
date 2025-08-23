// carList에서 선택한 차량에 대한 정보를 나타내기
// api/location/{vehicleNumber}

// param
// vehicleNumber=12가3456
// gpsRecordId=0 (초기값은 0, 그 이후로는 응답의 gpsRecordId)

import { api } from "../index";

export interface Location {
	ontime: string;
	latitude: number;
	longitude: number;
}

export interface SelectedCar {
	vehicleNumber: string;
	vehicleName: string;
	drivingDate: string;
	drivingTime: number;
	drivingDistanceKm: number;
	location: Location;
	gpsRecordId: number;
	status: string;
}

export async function fetchSelectedCarStat(vehicleNumber: string): Promise<SelectedCar> {
	const stats = await api.get(`api/location/${vehicleNumber}`
	).json<SelectedCar>();

	return stats;
}

// ex) api/location/12가1234?gpsRecordId=1004 로 전달됨