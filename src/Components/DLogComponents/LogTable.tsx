import { useDLogStore } from "@/Store/dlogStore";
import { TablePagination } from "../TablePagination";

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/ui/table";
import { ChevronRight } from "lucide-react";
import { ArrowDownNarrowWide } from "lucide-react";
import { ArrowDownWideNarrow } from "lucide-react";
import { useState, useRef } from "react";

export function LogTable() {
  const tableRef = useRef<HTMLDivElement>(null); // 테이블의 너비값을 전달하기 위한 wrapper
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const handleSort = () => {
    setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const dlogs = useDLogStore((state) =>
    state.filteredDLogs.length > 0 ? state.filteredDLogs : state.DLogs
  );

  const sortedDLogs = [...dlogs].sort((a, b) => {
    const aVal = a.startTime.slice(0, 10);
    const bVal = b.startTime.slice(0, 10);

    return sortDirection === "asc"
      ? aVal.localeCompare(bVal)
      : bVal.localeCompare(aVal);
  });

  const visibleDLogs = sortedDLogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div ref={tableRef} className="h-[470px] w-full flex flex-col gap-4 p-1">
      <Table className="table-fixed w-full">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[35px] text-start cursor-pointer">
              <div className="flex items-center justify-center gap-1">
                {sortDirection === "asc" ? (
                  <ArrowDownNarrowWide onClick={() => handleSort()} />
                ) : (
                  <ArrowDownWideNarrow onClick={() => handleSort()} />
                )}
              </div>
            </TableHead>
            <TableHead className="w-[100px] text-start">
              <div className="flex items-center justify-center gap-1">
                <span>차량 번호</span>
              </div>
            </TableHead>
            <TableHead className="text-start ">
              <div className="flex items-center justify-center gap-1">
                <span>차량명</span>
              </div>
            </TableHead>
            <TableHead className="text-start ">
              <div className="flex items-center justify-center gap-1">
                <span>시작 시간</span>
              </div>
            </TableHead>
            <TableHead className="text-start ">
              <div className="flex items-center justify-center gap-1">
                <span>종료 시간</span>
              </div>
            </TableHead>
            <TableHead className="w-[100px] text-start ">
              <div className="flex items-center justify-center gap-1">
                <span>총 주행거리</span>
              </div>
            </TableHead>
            <TableHead className="w-[100px] text-start ">
              <div className="flex items-center justify-center gap-1">
                <span>운전자</span>
              </div>
            </TableHead>
            <TableHead className="text-right"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {visibleDLogs.map((dlog) => (
            <TableRow key={dlog.carNumber} className="text-center">
              <TableCell></TableCell>
              <TableCell className="font-medium">{dlog.carNumber}</TableCell>
              <TableCell>{dlog.carName}</TableCell>
              <TableCell>{dlog.startTime.replace("T", " ")}</TableCell>
              <TableCell>{dlog.endTime.replace("T", " ")}</TableCell>
              <TableCell>{dlog.distance.toLocaleString()} km</TableCell>
              <TableCell>{dlog.driver}</TableCell>
              <TableCell className="text-right ">
                <ChevronRight
                  className="inline-block pr-2"
                  onClick={() => {}}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter></TableFooter>
      </Table>
      <TablePagination
        tableRef={tableRef}
        total={Math.ceil(dlogs.length / itemsPerPage)}
        current={currentPage}
        setCurrent={setCurrentPage}
      />
    </div>
  );
}
