import { TablePagination } from "../TablePagination";
import { Table } from "../ui/table";
import { ChevronRight } from "lucide-react";
import { useState, useRef } from "react";

export function LogTable() {
  const tableRef = useRef<HTMLDivElement>(null); // 테이블의 너비값을 전달하기 위한 wrapper

  return (
    <div className="">
      {/* <Table>
    </Table>
    <TablePagination>

    </TablePagination> */}
    </div>
  );
}
