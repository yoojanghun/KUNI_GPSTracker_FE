import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/Components/ui/pagination";
import { useEffect, useState } from "react";

function getPageNums(current: number, total: number, maxItem: number) {
  const half = Math.floor(maxItem / 2);
  let start = Math.max(1, current - half);
  let end = start + maxItem - 1;

  if (end > total) {
    end = total;
    start = Math.max(1, end - maxItem + 1);
  }

  const pages: number[] = [];
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return pages;
}


export function TablePagination({
  tableRef,
  total,
  current,
  setCurrent,
}: {
  tableRef: React.RefObject<HTMLDivElement | null>;
  total: number;
  current: number;
  setCurrent: (page: number) => void;
}) {
  const [tableWidth, setTableWidth] = useState(0);

  // 테이블 크기 추적
  useEffect(() => {
    const updateWidth = () => {
      if (tableRef.current) {
        setTableWidth(tableRef.current.offsetWidth);
      }
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  // 페이지 아이템 수 계산
  const numberButtonWidth = 40; // 페이지 번호 버튼 가로 길이
  const sideButtonWidth = 50 * 2; // prev + next 버튼 총 너비
  const availableWidth = tableWidth - sideButtonWidth;
  const maxVisibleItems = Math.floor(availableWidth / numberButtonWidth);

  const pageNums = getPageNums(current, total, maxVisibleItems);

  return (
    <div ref={tableRef} className="w-full flex justify-center">
      <Pagination className="flex items-center">
        <PaginationContent className="flex items-center gap-2">
          <PaginationItem>
            <PaginationPrevious
              onClick={() => current > 1 && setCurrent(current - 1)}
            />
          </PaginationItem>

          <div className="flex gap-1 justify-center">
            {pageNums.map((item, idx) => (
              <PaginationItem key={idx}>
                <PaginationLink
                  isActive={item === current}
                  onClick={() => setCurrent(item)}
                >
                  {item}
                </PaginationLink>
              </PaginationItem>
            ))}
          </div>

          <PaginationItem>
            <PaginationNext
              onClick={() => current < total && setCurrent(current + 1)}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}