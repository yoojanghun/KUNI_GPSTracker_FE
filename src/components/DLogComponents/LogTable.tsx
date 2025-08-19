// src/components/DLogComponents/LogTable.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChevronRight,
  Clock4,
  ClockArrowDown,
  ClockArrowUp,
  ClockFading,
} from "lucide-react";
import { TablePagination } from "@/components/TablePagination";
import { useDlogsQuery } from "@/Queries/useDlogsQuery";
import { useDLogStore } from "@/Store/dlogStore";
import { toast } from "sonner";
import { CircleQuestionMark } from "lucide-react";

export function LogTable() {
  const navigate = useNavigate();
  const location = useLocation();
  const tableRef = useRef<HTMLDivElement>(null);

  // 화면 높이에 따른 rows-per-page (간단 계산)
  const tableRowHeight = 70;

  const defaultPage = location.state?.page ?? 1;
  const [currentPage, setCurrentPage] = useState(defaultPage);
  const itemsPerPage = useMemo(
    () => Math.max(1, Math.floor(window.innerHeight / tableRowHeight)),
    []
  );

  const [sortDirection, setSortDirection] = useState<
    "onTime,ASC" | "onTime,DESC"
  >("onTime,ASC");
  const handleSort = (p: "onTime,ASC" | "onTime,DESC") => setSortDirection(p);

  const vehicleNumber = useDLogStore((s) => s.appliedVehicleNumber);
  const startTime = useDLogStore((s) => s.appliedStartTime);
  const endTime = useDLogStore((s) => s.appliedEndTime);
  const searchNonce = useDLogStore((s) => s.searchNonce);

  const { data, isLoading, isFetching } = useDlogsQuery({
    page: currentPage,
    size: itemsPerPage,
    sort: sortDirection,
    vehicleNumber,
    startTime,
    endTime,
    enabled: true,
    searchNonce, // searchNonce -> 같은 조건으로 검색 시 강제 refetch
  });

  useEffect(() => {
    if (data && (data.content?.length ?? 0) === 0) {
      toast("검색된 차량이 없습니다.", {
        icon: <CircleQuestionMark />,
      });
      return;
    }
  }, [data]);

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
            <TableHead className="text-center">
              <div className="inline-flex items-center justify-center text-[#ACACAC] font-bold">
                차량 번호
              </div>
            </TableHead>
            <TableHead className="text-center">
              <div
                className="inline-flex items-center justify-center font-bold gap-2 cursor-pointer hover:text-[#000000]/60"
                onClick={() => handleSort("onTime,ASC")}
              >
                <Clock4 size={20} />
                <span>시작 시간</span>
              </div>
            </TableHead>
            <TableHead className="text-center">
              <div
                className="inline-flex items-center justify-center font-bold gap-2 cursor-pointer hover:text-[#000000]/60"
                onClick={() => handleSort("onTime,DESC")}
              >
                <ClockFading size={20} />
                <span>종료 시간</span>
              </div>
            </TableHead>

            <TableHead className="text-center">
              <div className="inline-flex items-center justify-center text-[#ACACAC] font-bold">
                차량명
              </div>
            </TableHead>
            <TableHead className="w-[100px] text-center">
              <div className="inline-flex items-center justify-center text-[#ACACAC] font-bold">
                총 주행거리
              </div>
            </TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {isLoading && (
            <TableRow>
              <TableCell colSpan={7} className="text-center">
                불러오는 중…
              </TableCell>
            </TableRow>
          )}

          {!isLoading &&
            logs.map((dlog) => (
              <TableRow
                key={dlog.id}
                className="text-center cursor-pointer"
                onClick={() =>
                  navigate(`/log/${dlog.id}`, {
                    state: { id: dlog.id, page: currentPage },
                  })
                }
              >
                <TableCell className="font-medium">
                  {dlog.vehicleNumber}
                </TableCell>
                <TableCell>{dlog.onTime.replace("T", " ")}</TableCell>
                <TableCell>{dlog.offTime.replace("T", " ")}</TableCell>

                <TableCell>{dlog.vehicleName}</TableCell>
                <TableCell>
                  {(Number(dlog.sumDist) / 1000).toFixed(1)} km
                </TableCell>
                <TableCell className="text-right">
                  <ChevronRight className="inline-block pr-2" />
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
