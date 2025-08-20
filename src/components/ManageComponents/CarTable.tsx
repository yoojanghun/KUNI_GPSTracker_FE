import { useState, useEffect, useCallback, useRef } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { StatusBadge } from "@/components/StatusBadge";
import { TablePagination } from "@/components/TablePagination";
import { ArrowDownUp, ChevronDown, ChevronUp, CircleQuestionMark, Dot } from "lucide-react";
import type { getCarListRequest } from "@/Api/ManageApi/interfaces/getCarListRequest";
import { useCarStore } from "@/Store/carStore";
import { useManageQuery } from "@/Queries/useManageQuery";
import { toast } from "sonner";
import { Skeleton } from "../ui/skeleton";
import { cn } from "@/lib/utils";

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
  const applySearch = useCarStore((state) => state.applySearch);

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
  if (data && (data.content?.length ?? 0) === 0) {
    setCars([]);
    setTotalPage(0);
    toast("검색된 차량이 없습니다.", {
      icon: <CircleQuestionMark />
    });
    return;
  }
  setCars(data?.content ?? []);
  setTotalPage(data?.totalPages ?? 0);
}, [data, setCars, setTotalPage]);

useEffect(() => { 
  applySearch();
 },[]);

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
              className="w-[35px] text-start"
              onClick={() => handleSort("vehicleNumber")}
            >
              <div className={cn("inline-flex items-center justify-center gap-1 cursor-pointer text-[#000000]/60 hover:text-[#000000]", sortKey === "vehicleNumber" && "text-[#000000] hover:text-[#000000]/60" )}>
                { sortKey === "vehicleNumber" && sortDirection === "ASC" && <ChevronUp size={14} /> }
                { sortKey === "vehicleNumber" && sortDirection === "DESC" && <ChevronDown size={14} />}
                {/* 공간 차지용 아이콘 */}
                { sortKey !== "vehicleNumber" && <ChevronDown size={14} className="invisible" />} 
                <span>차량 번호</span>
              </div>
            </TableHead>
            <TableHead
              className="text-center "
              onClick={() => handleSort("type")}
            >
              <div className={cn("inline-flex items-center justify-center gap-1 cursor-pointer text-[#000000]/60 hover:text-[#000000]", sortKey === "type" && "text-[#000000] hover:text-[#000000]/60" )}>
              { sortKey === "type" && sortDirection === "ASC" && <ChevronUp size={14} /> }
                { sortKey === "type" && sortDirection === "DESC" && <ChevronDown size={14} />}
                {/* 공간 차지용 아이콘 */}
                { sortKey !== "type" && <ChevronDown size={14} className="invisible" />} 
                
                <span>차량명</span>
              </div>
            </TableHead>
            <TableHead
              className="text-center"
              onClick={() => handleSort("totalDist")}
            >
              <div className={cn("inline-flex items-center justify-center gap-1 cursor-pointer text-[#000000]/60 hover:text-[#000000]", sortKey === "totalDist" && "text-[#000000] hover:text-[#000000]/60" )}>
              { sortKey === "totalDist" && sortDirection === "ASC" && <ChevronUp size={14} /> }
                { sortKey === "totalDist" && sortDirection === "DESC" && <ChevronDown size={14} />}
                {/* 공간 차지용 아이콘 */}
                { sortKey !== "totalDist" && <ChevronDown size={14} className="invisible" />} 
                
                <span>주행거리</span>
              </div>
            </TableHead>
            <TableHead
              className="text-center"
              onClick={() => handleSort("status")}
            >
              <div className={cn("inline-flex items-center justify-center gap-1 cursor-pointer text-[#000000]/60 hover:text-[#000000]", sortKey === "status" && "text-[#000000] hover:text-[#000000]/60" )}>
              { sortKey === "status" && sortDirection === "ASC" && <ChevronUp size={14} /> }
                { sortKey === "status" && sortDirection === "DESC" && <ChevronDown size={14} />}
                {/* 공간 차지용 아이콘 */}
                { sortKey !== "status" && <ChevronDown size={14} className="invisible" />} 
                
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
          {isLoading && 
            Array.from({ length: itemsPerPage }).map((_, index) => (
                <TableRow key={index} className="text-center">
                  <TableCell>
                    <Skeleton className="h-[1.3em] w-[80%]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-[1.3em] w-[80%]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-[1.3em] w-[80%]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-[1.3em] w-[80%]" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Checkbox />
                  </TableCell>
                </TableRow>
              ))
          }
          {!isLoading && cars.map((car) => (
            <TableRow key={car.carNumber} className="text-center cursor-pointer">
              <TableCell className="font-medium">{car.carNumber}</TableCell>
              <TableCell>{car.type}</TableCell>
              <TableCell>{(Number(car.totalDist) / 1000).toFixed(1)} km</TableCell>
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
