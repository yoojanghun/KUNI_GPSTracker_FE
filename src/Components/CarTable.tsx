import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/ui/table"
import { Checkbox } from "./ui/checkbox";
import { TablePagination } from "./TablePagination";
import { useRef, useState } from "react";
import { useCarStore } from "../Store/carStore";

export function CarTable() {
  const tableRef = useRef<HTMLDivElement>(null); // 테이블의 너비값을 전달하기 위한 wrapper
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const cars = useCarStore((state) => state.filteredCars.length > 0 ? state.filteredCars : state.cars);
  const selectedCars = useCarStore((state) => state.selected);
  const toggleSelection = useCarStore((state) => state.toggleSelect);
  const toggleSelectAll = useCarStore((state) => state.toggleSelectAll);

  const visibleCars = cars.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const isAllSelected = visibleCars.every((car) => selectedCars.has(car.number));

  return (
    <div ref={tableRef} 
    className="h-[470px] w-full flex flex-col gap-4 p-1"
    >
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">차량 번호</TableHead>
          <TableHead>차량명</TableHead>
          <TableHead>주행거리</TableHead>
          <TableHead>상태</TableHead>
          <TableHead className="text-right">
            <Checkbox checked={isAllSelected} onCheckedChange={() => toggleSelectAll(visibleCars)} />
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {visibleCars.map((car) => (
          <TableRow key={car.number}>
            <TableCell className="font-medium">{car.number}</TableCell>
            <TableCell>{car.name}</TableCell>
            <TableCell>{car.mileage}</TableCell>
            <TableCell>{car.status}</TableCell>
            <TableCell className="text-right">
              <Checkbox
                checked={selectedCars.has(car.number)}
                onCheckedChange={() => toggleSelection(car.number)}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        
      </TableFooter>
    </Table>
      <TablePagination
      tableRef={tableRef}
      total={Math.ceil(cars.length / itemsPerPage)}
      current={currentPage}
      setCurrent={setCurrentPage}
    />
    
    </div>
  );
}
