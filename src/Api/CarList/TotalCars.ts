// carList에서 차량들을 페이지네이션하여 목록들을 보여주기 위해 사용
// api/vehicle 차량 목록 조회

import { api } from "../index";

export interface Car {
  carNumber: string;
	type: string;
	status: string;
	totalDist: number;
}
export interface Sort {
	empty: boolean;
	sorted: boolean;
	unsorted: boolean;
}
export interface Pageable {
	pageNumber: number;
	pageSize: number;
	sort: Sort;
	offset: number;
	paged: boolean;
	unpaged: boolean;
}
export interface TotalCarsList {
	content: Car[];
	pageable: Pageable;
	totalPages: number;
	totalElements: number;
	last: boolean;
	size: number;
	number: number;
	sort: Sort;
	numberOfElements: number;
	first: boolean;
	empty: boolean;
}

export async function fetchTotalCarsList(
	page: number = 0, 
	size: number = 7, 
	status: string = ""
): Promise<TotalCarsList> {
	const stats = await api.get("api/vehicle",
		{searchParams: {page, size, status}}
	).json<TotalCarsList>();

	return stats;
}