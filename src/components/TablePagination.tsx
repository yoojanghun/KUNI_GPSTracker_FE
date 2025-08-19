import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
  PaginationDoublePrevious,
  PaginationDoubleNext,
} from "@/components/ui/pagination";
import { useEffect, useState } from "react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "./ui/context-menu";

function getPages(
  current: number,
  total: number,
  tableWidth: number
): (number | "...")[] {
  const btnWidth = 40; // 페이지네이션 버튼 크기
  const sideBtnWidth = 50 * 2; // prev + next 버튼 크기
  const maxFullShow = Math.floor((tableWidth - sideBtnWidth) / 2 / btnWidth);

  // 너비와 총 아이템 개수에 따라 모든 페이지네이션 노출
  if (total <= maxFullShow) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | "...")[] = [];

  if (current <= 4) {
    // 1 ~ 4 페이지까지는 항상 노출
    for (let i = 1; i <= Math.min(5, total); i++) {
      pages.push(i);
    }
    if (total > 5) {
      pages.push("...");
      pages.push(total);
    }
  } else if (current >= total - 3) {
    // 마지막 ~ 마지막 - 3 페이지까진 항상 노출
    pages.push(1);
    pages.push("...");
    for (let i = Math.max(total - 4, 1); i <= total; i++) {
      pages.push(i);
    }
  } else {
    // 그 외의 경우 좌우에 ellipsis 표시
    pages.push(1);
    pages.push("...");
    pages.push(current - 1);
    pages.push(current);
    pages.push(current + 1);
    pages.push("...");
    pages.push(total);
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

  const pageTokens = getPages(current, total, tableWidth);

  return (
    <div ref={tableRef} className="w-full flex justify-center">
      <Pagination className="flex items-center">
        <PaginationContent className="flex items-center gap-2">
          <PaginationItem>
            <ContextMenu>
              <ContextMenuTrigger asChild>
                <PaginationDoublePrevious
                  onClick={() => {
                    current > 3 ? setCurrent(current - 3) : setCurrent(1);
                  }}
                />
              </ContextMenuTrigger>
              <ContextMenuContent>
                <ContextMenuItem onClick={() => setCurrent(1)}>처음으로 이동</ContextMenuItem>
                <ContextMenuItem onClick={() => { current > 10 ? setCurrent(current - 10) : setCurrent(1)}}>10페이지 뒤로</ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>

            <PaginationPrevious
              onClick={() => current > 1 && setCurrent(current - 1)}
            />
          </PaginationItem>

          <div className="flex gap-1 justify-center">
            {pageTokens.map((token, idx) => (
              <PaginationItem key={idx}>
                {token === "..." ? (
                  <PaginationEllipsis />
                ) : (
                  <PaginationLink
                    isActive={token === current}
                    onClick={() => setCurrent(token as number)}
                  >
                    {token}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}
          </div>

          <PaginationItem>
            <PaginationNext
              onClick={() => current < total && setCurrent(current + 1)}
            />
            <ContextMenu>
              <ContextMenuTrigger asChild>
                <PaginationDoubleNext
                  onClick={() => {
                    current < total - 2
                      ? setCurrent(current + 3)
                      : setCurrent(total);
                  }}
                />
              </ContextMenuTrigger>
              <ContextMenuContent>
                <ContextMenuItem onClick={() =>  setCurrent(total)}>마지막으로 이동</ContextMenuItem>
                <ContextMenuItem onClick={() => { current < total - 9 ? setCurrent(current + 10) : setCurrent(total) }}>10페이지 앞으로</ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
