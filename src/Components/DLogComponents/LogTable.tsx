import { useEffect, useCallback, useState, useRef } from "react";
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
import { ChevronRight, ClockArrowDown, ClockArrowUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDLogStore } from "@/Store/dlogStore";


export function LogTable() {
  const navigate = useNavigate();

  const tableRef = useRef<HTMLDivElement>(null); // 테이블의 너비값을 전달하기 위한 wrapper
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // TODO: 사용자 기기의 크기에 따라 개수 조절

  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const handleSort = () => {
    setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const fetchDLogs = useDLogStore((state) => state.fetchDLogs);
  const totalPages = useDLogStore((state) => state.totalPage);
  const logs = useDLogStore((state) => state.DLogs);

  const fetchAndSetLogs = useCallback(async () => {
    try {
      await fetchDLogs({
        page: currentPage - 1,
        size: itemsPerPage,
        sort: sortDirection,
      })
    } catch (err) {
      console.error("Error fetching logs:", err);
    }
  }, [currentPage, sortDirection, fetchDLogs]);

  useEffect(() => {
    fetchAndSetLogs();
  }, [fetchAndSetLogs]);


  return (
    <div ref={tableRef} className="h-[470px] w-full flex flex-col gap-4 p-1">
      <Table className="table-fixed w-full">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[35px] text-start cursor-pointer">
              <div className="flex items-center justify-center gap-1">
                {sortDirection === "asc" ? (
                  <ClockArrowDown onClick={() => handleSort()} />
                ) : (
                  <ClockArrowUp onClick={() => handleSort()} />
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
            <TableHead className="text-right"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map((dlog) => (
            <TableRow key={dlog.vehicleNumber} className="text-center">
              <TableCell></TableCell>
              <TableCell className="font-medium">{dlog.vehicleNumber}</TableCell>
              <TableCell>{dlog.vehicleName}</TableCell>
              <TableCell>{dlog.onTime.replace("T", " ")}</TableCell>
              <TableCell>{dlog.offTime.replace("T", " ")}</TableCell>
              <TableCell>{dlog.sumDist.toLocaleString()} km</TableCell>
              <TableCell className="text-right ">
                <ChevronRight
                  className="inline-block pr-2 cursor-pointer"
                  onClick={() => navigate(`/log/${dlog.id}`, {
                    state: {
                      id: dlog.id,
                    }
                  })}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter></TableFooter>
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
