// import * as React from "react"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import { useCarStore } from "@/Store/carStore";

export function StatusSelect() {
  const filter = useCarStore((state) => state.filter);
  const setFilter = useCarStore((state) => state.setFilter);

  const handleChange = (value: string) => {
    setFilter({ ...filter, status: value });
  };

  return (
    <div className="w-[110px]">
      <Select value={filter.status} onValueChange={handleChange}>
        <SelectTrigger className="px-3 py-4">
          <SelectValue placeholder="현황" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="운행중">운행중</SelectItem>
            <SelectItem value="미운행">미운행</SelectItem>
            <SelectItem value="점검중">점검중</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
