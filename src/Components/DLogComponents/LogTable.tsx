// src/Components/DLogComponents/LogTable.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
import { ChevronRight, ClockArrowDown, ClockArrowUp } from "lucide-react";
import { TablePagination } from "@/Components/TablePagination";
import { useDlogsQuery } from "@/Queries/useDlogsQuery";
import { useDLogStore } from "@/Store/dlogStore";

export function LogTable() {
  const navigate = useNavigate();
  const tableRef = useRef<HTMLDivElement>(null);

  // 화면 높이에 따른 rows-per-page (간단 계산)
  const tableRowHeight = 70;
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = useMemo(() => Math.max(1, Math.floor(window.innerHeight / tableRowHeight)), []);

  const [sortDirection, setSortDirection] = useState<"onTime,ASC" | "onTime,DESC">("onTime,ASC");
  const handleSort = () => setSortDirection((p) => (p === "onTime,ASC" ? "onTime,DESC" : "onTime,ASC"));

const vehicleNumber = useDLogStore(s => s.appliedVehicleNumber);
const startTime = useDLogStore(s => s.appliedStartTime);
const endTime = useDLogStore(s => s.appliedEndTime);
const searchNonce = useDLogStore(s => s.searchNonce);

const { data, isLoading, isFetching } = useDlogsQuery({
  page: currentPage, size: itemsPerPage, sort: sortDirection, vehicleNumber, startTime, endTime,
  enabled: true,
  searchNonce, // searchNonce -> 같은 조건으로 검색 시 강제 refetch
});

  // 로딩/페칭 처리(필요 최소치만)
  useEffect(() => {
    if (isFetching) {
      // 필요하면 shadcn toast로 "갱신 중" 안내 가능
    }
  }, [isFetching]);

  const totalPages = data?.totalPages ?? 1;
  const logs = data?.content ?? [];

  return (
    <div ref={tableRef}>
      <Table className="my-4">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[35px] text-start cursor-pointer">
              <div className="flex items-center justify-center gap-1">
                {sortDirection === "onTime,ASC" ? (
                  <ClockArrowUp onClick={handleSort} />
                ) : (
                  <ClockArrowDown onClick={handleSort} />
                )}
              </div>
            </TableHead>
            <TableHead className="text-start"><div className="flex items-center justify-center">차량 번호</div></TableHead>
            <TableHead className="text-start"><div className="flex items-center justify-center">차량명</div></TableHead>
            <TableHead className="text-start"><div className="flex items-center justify-center">시작 시간</div></TableHead>
            <TableHead className="text-start"><div className="flex items-center justify-center">종료 시간</div></TableHead>
            <TableHead className="w-[100px] text-start"><div className="flex items-center justify-center">총 주행거리</div></TableHead>
            <TableHead className="text-right"></TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {isLoading && (
            <TableRow><TableCell colSpan={7} className="text-center">불러오는 중…</TableCell></TableRow>
          )}

          {!isLoading && logs.map((dlog) => (
            <TableRow key={dlog.id} className="text-center">
              <TableCell></TableCell>
              <TableCell className="font-medium">{dlog.vehicleNumber}</TableCell>
              <TableCell>{dlog.vehicleName}</TableCell>
              <TableCell>{dlog.onTime.replace("T", " ")}</TableCell>
              <TableCell>{dlog.offTime.replace("T", " ")}</TableCell>
              <TableCell>{(Number(dlog.sumDist) / 1000).toFixed(1)} km</TableCell>
              <TableCell className="text-right">
                <ChevronRight
                  className="inline-block pr-2 cursor-pointer"
                  onClick={() => navigate(`/log/${dlog.id}`, { state: { id: dlog.id } })}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>

        <TableFooter />
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