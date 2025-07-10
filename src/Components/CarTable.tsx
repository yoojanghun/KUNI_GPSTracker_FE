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
  const itemsPerPage = 10;
  return (
    <div ref={tableRef}>
    <Table>
      {/* <TableCaption></TableCaption> */}
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">차량 번호</TableHead>
          <TableHead>차량명</TableHead>
          <TableHead>주행거리</TableHead>
          <TableHead>상태</TableHead>
          <TableHead className="text-right"><Checkbox/></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {currentCarList
          .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage) // ex) 1페이지: 1~10번째 요소 
          .map((car) => (
            <TableRow key={car.number}>
              <TableCell className="font-medium">{car.number}</TableCell>
              <TableCell>{car.name}</TableCell>
              <TableCell>{car.mileage}</TableCell>
              <TableCell>{car.status}</TableCell>
              <TableCell className="text-right"><Checkbox/></TableCell>
            </TableRow>
        ))}
      </TableBody>
      <TableFooter>
      </TableFooter>
    </Table>
    <TablePagination
      tableRef={tableRef} // carTable 크기 계산
      total={Math.ceil(currentCarList.length / itemsPerPage)} // 페이지네이션 개수 계산
      current={currentPage}
      setCurrent={setCurrentPage} // currentPage의 상태를 공유하기 위해 TablePagination에 전달
    />
    </div>
  );
}
