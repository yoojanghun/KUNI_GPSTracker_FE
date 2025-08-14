import { useState, useEffect, useCallback, useRef } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHead,
  TableRow,
} from "@/Components/ui/table";
import { Checkbox } from "@/Components/ui/checkbox";
import { StatusBadge } from "@/Components/StatusBadge";
import { TablePagination } from "@/Components/TablePagination";
import { ArrowDownUp } from "lucide-react";
import type { getCarListRequest } from "@/Api/ManageApi/interfaces/getCarListRequest";
import { useCarStore } from "@/Store/carStore";
import { useManageQuery } from "@/Queries/useManageQuery";

export default function CarTable() {

  const [sortKey, setSortKey] = useState<"createDate" | "vehicleNumber" | "type" | "totalDist" | "status">();
  // 정렬 방향은 API 스펙(ASC/DESC)에 맞춰 대문자로 관리
  const [sortDirection, setSortDirection] = useState<"ASC" | "DESC">("ASC");
  const [currentPage, setCurrentPage] = useState(1);
  const tableRef = useRef<HTMLDivElement>(null); // 테이블의 너비값을 전달하기 위한 wrapper

  // 선택 상태는 기존 전역 스토어 사용 유지
  const selectedCars = Array.from(useCarStore((state) => state.selected));
  const setSelected = useCarStore((state) => state.setSelected);
  const toggleSelectAll = useCarStore((state) => state.toggleSelectAll);
  const isAllSelected = useCarStore((state) => state.isAllSelected);
  const vehicleName = useCarStore((state) => state.appliedVehicleName);
  const status = useCarStore((state) => state.appliedStatus);
  const searchNonce = useCarStore(s => s.searchNonce);
  const cars = useCarStore((state) => state.cars);
  const setCars = useCarStore((state) => state.setCars);
  const totalPages = useCarStore((state) => state.totalPage);
  const setTotalPage = useCarStore((state) => state.setTotalPage);

  const tableRowHeight = 70;
  const itemsPerPage = Math.floor((window.innerHeight) / tableRowHeight);

  // 정렬 키를 생성하기 위한 로직, getSortParam(sortKey, sortDirection) 를 통해 키값을 얻을 수 있음
  const VALID_SORT_KEYS = [
    "createDate",
    "vehicleNumber",
    "type",
    "totalDist",
    "status",
  ] as const;

  const isValidSortKey = (
    key: string
  ): key is (typeof VALID_SORT_KEYS)[number] => {
    return VALID_SORT_KEYS.includes(key as any);
  };

  const getSortParam = (
    direction: string,
    key?: "createDate" | "vehicleNumber" | "type" | "totalDist" | "status",
    
  ): getCarListRequest["sort"] => {
    const dir = direction.toUpperCase() === "DESC" ? "DESC" : "ASC";
    const defaultSort = `createDate,DESC` as getCarListRequest["sort"];

    if (!key || !isValidSortKey(key)) return defaultSort;

    const sortParam = `${key},${dir}` as getCarListRequest["sort"];
    return sortParam;
  };

  // API 정렬 파라미터 생성
  const sortParam = getSortParam(sortDirection, sortKey);

  // 차량 목록 쿼리 (페이지 변경/정렬 변경 시 자동 갱신)
  const { data, isLoading, isError } = useManageQuery({
    page: currentPage,
    size: itemsPerPage,
    sort: sortParam,
    vehicleName: vehicleName,
    status: status,
    searchNonce: searchNonce, // searchNonce -> 같은 조건으로 검색 시 강제 refetch
  });

  useEffect(() => {
    if (!data) {
      setCars([]);
      setTotalPage(0);
      return;
    }
    setCars(data.content ?? []);
    setTotalPage(data.totalPages ?? 0);
  }, [data, setCars, setTotalPage]);

  // 응답 데이터 매핑 (API 스펙에 맞춰 조정)
  // const cars = data?.content ?? [];
  // const totalPages = data?.totalPages ?? 0;

  console.log(cars.map(c => c.carNumber));

  const handleSort = (key: "createDate" | "vehicleNumber" | "type" | "totalDist" | "status") => {
    if (sortKey === key) {
      setSortDirection(sortDirection === "ASC" ? "DESC" : "ASC");
    } else {
      setSortKey(key);
      setSortDirection("ASC");
    }
    console.log("current sort: ", )
  };

  if (isError) {
    return <div ref={tableRef}>데이터를 불러오지 못했습니다.</div>;
  }

  return (
    <div ref={tableRef}>
      <Table className="my-4">
        <TableHeader>
          <TableRow>
            <TableHead
              className="w-[35px] text-start cursor-pointer"
              onClick={() => handleSort("vehicleNumber")}
            >
              <div className="flex items-center justify-center gap-1">
                <ArrowDownUp size={14} />
                <span>차량 번호</span>
              </div>
            </TableHead>
            <TableHead
              className="text-center cursor-pointer"
              onClick={() => handleSort("type")}
            >
              <div className="flex items-center justify-center gap-1">
                <ArrowDownUp size={14} />
                <span>차량명</span>
              </div>
            </TableHead>
            <TableHead
              className="text-center cursor-pointer"
              onClick={() => handleSort("totalDist")}
            >
              <div className="flex items-center justify-center gap-1">
                <ArrowDownUp size={14} />
                <span>주행거리</span>
              </div>
            </TableHead>
            <TableHead
              className="text-center cursor-pointer"
              onClick={() => handleSort("status")}
            >
              <div className="flex items-center justify-center gap-1">
                <ArrowDownUp size={14} />
                <span>상태</span>
              </div>
            </TableHead>
            <TableHead className="text-right">
              <Checkbox
                checked={isAllSelected()}
                onCheckedChange={() => toggleSelectAll()}
              />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading && (
            <TableRow>
              <TableCell colSpan={5} className="text-center">불러오는 중…</TableCell>
            </TableRow>
          )}
          {!isLoading && cars.map((car) => (
            <TableRow key={car.carNumber} className="text-center">
              <TableCell className="font-medium">{car.carNumber}</TableCell>
              <TableCell>{car.type}</TableCell>
              <TableCell>{car.totalDist.toLocaleString()} km</TableCell>
              <TableCell>
                <StatusBadge status={car.status} />
              </TableCell>
              <TableCell className="text-right">
                <Checkbox
                  checked={selectedCars.includes(car.carNumber)}
                  onCheckedChange={() => {
                    if (selectedCars.includes(car.carNumber)) {
                      setSelected(selectedCars.filter(id => id !== car.carNumber));
                    } else {
                      setSelected([...selectedCars, car.carNumber]);
                    }
                  }}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination
        tableRef={tableRef}
        total={totalPages}
        current={currentPage}
        setCurrent={setCurrentPage}
      />
    </div>
  );
}
