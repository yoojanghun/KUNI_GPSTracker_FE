import { useState } from "react";
import type { getCarListRequest } from "@/Api/ManageApi/interfaces/getCarListRequest";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCarStore } from "@/Store/carStore";

export function StatusSelect() {
  const setStatus = useCarStore((state) => state.setStatus);

  const [localStatus, setLocalStatus] = useState<getCarListRequest["status"] | "">("");

  const handleChange = (value: string) => {
    setLocalStatus(value as getCarListRequest["status"]);
    setStatus(value as getCarListRequest["status"]); // 전역 상태에도 반영
  };

  return (
    <div className="w-[110px]">
      <Select value={localStatus} onValueChange={handleChange}>
        <SelectTrigger className="px-3 py-4">
          <SelectValue placeholder="현황" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="ACTIVE">운행중</SelectItem>
            <SelectItem value="INACTIVE">미운행</SelectItem>
            <SelectItem value="INSPECTING">수리중</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}