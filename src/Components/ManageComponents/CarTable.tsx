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
import type { carList } from "@/Api/ManageApi/interfaces/getCarListResponse";
import { ArrowDownUp } from "lucide-react";
import type { getCarListRequest } from "@/Api/ManageApi/interfaces/getCarListRequest";
import { useCarStore } from "@/Store/carStore";

export default function CarTable() {
  const [sortKey, setSortKey] = useState<keyof carList>();
  const [sortDirection, setSortDirection] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const tableRef = useRef<HTMLDivElement>(null); // 테이블의 너비값을 전달하기 위한 wrapper

  const cars = useCarStore((state) => state.cars);
  const totalPages = useCarStore((state) => state.totalPage);
  const selectedCars = Array.from(useCarStore((state) => state.selected));
  const setSelected = useCarStore((state) => state.setSelected);
  const toggleSelectAll = useCarStore((state) => state.toggleSelectAll);
  const isAllSelected = useCarStore((state) => state.isAllSelected);
  const fetchCars = useCarStore((state) => state.fetchCars);

  const tableRowHeight = 70;
  const itemsPerPage = Math.floor((window.innerHeight) / tableRowHeight);

  // 정렬 키를 생성하기 위한 로직, getSortParam(sortKey, sortDirection) 를 통해 키값을 얻을 수 있음
  const VALID_SORT_KEYS = [
    "createDate",
    "carNumber",
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
    key: keyof carList | undefined,
    direction: string
  ): getCarListRequest["sort"] => {
    const dir = direction.toUpperCase() === "DESC" ? "DESC" : "ASC";
    const defaultSort = `createDate,DESC` as getCarListRequest["sort"];

    if (!key || !isValidSortKey(key)) return defaultSort;

    const sortParam = `${key},${dir}` as getCarListRequest["sort"];
    return sortParam;
  };

  const fetchAndSetCars = useCallback(async () => {
    try {
      const sort = getSortParam(sortKey, sortDirection);
      await fetchCars({page: currentPage - 1, size: itemsPerPage, sort: sort});
    } catch (err) {
      console.error("Failed to fetch cars", err);
    }
  }, [currentPage, sortKey, sortDirection, fetchCars]);

  useEffect(() => {
    fetchAndSetCars();
  }, [fetchAndSetCars]);

  const handleSort = (key: keyof carList) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === "ASC" ? "DESC" : "ASC");
    } else {
      setSortKey(key);
      setSortDirection("ASC");
    }
  };

  return (
    <div ref={tableRef}>
      <Table className="my-4">
        <TableHeader>
          <TableRow>
            <TableHead
              className="w-[35px] text-start cursor-pointer"
              onClick={() => handleSort("carNumber")}
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
          {cars.map((car) => (
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
