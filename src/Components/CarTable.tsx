import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/ui/table"
import { currentCarList } from "./currentCarList";
import { Checkbox } from "./ui/checkbox";
import { TablePagination } from "./TablePagination";
import { useRef, useState } from "react";

export function CarTable() {
  const tableRef = useRef<HTMLDivElement>(null); // 테이블의 너비값을 전달하기 위한 wrapper
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCars, setSelectedCars] = useState<Set<string>>(new Set());
  const itemsPerPage = 10;

  const visibleCars = currentCarList.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const isAllSelected = visibleCars.every((car) => selectedCars.has(car.number));

  const toggleSelection = (carNumber: string) => {
    setSelectedCars((prev) => {
      const updated = new Set(prev);
      if (updated.has(carNumber)) {
        updated.delete(carNumber);
      } else {
        updated.add(carNumber);
      }
      return updated;
    });
  };

  const toggleSelectAll = () => {
    setSelectedCars((prev) => {
      const updated = new Set(prev);
      if (isAllSelected) {
        visibleCars.forEach((car) => updated.delete(car.number));
      } else {
        visibleCars.forEach((car) => updated.add(car.number));
      }
      return updated;
    });
  };

  return (
    <div ref={tableRef}>
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">차량 번호</TableHead>
          <TableHead>차량명</TableHead>
          <TableHead>주행거리</TableHead>
          <TableHead>상태</TableHead>
          <TableHead className="text-right">
            <Checkbox checked={isAllSelected} onCheckedChange={toggleSelectAll} />
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
      total={Math.ceil(currentCarList.length / itemsPerPage)}
      current={currentPage}
      setCurrent={setCurrentPage}
    />
    </div>
  );
}
