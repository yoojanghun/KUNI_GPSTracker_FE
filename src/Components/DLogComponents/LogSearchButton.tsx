import { Button } from "@/Components/ui/button";
import { Search } from "lucide-react";
import { useDLogStore } from "@/Store/dlogStore";

export function LogSearchButton() {
  const applyFilter = useDLogStore((state) => state.applyFilter);

  return (
    <div className="flex flex-col">
      <span className="text-transparent">-</span>
      <Button
      onClick={applyFilter}
      className="bg-[#000000] gap-3 hover:bg-[#000000]/80"
    >
      <Search strokeWidth={3} size={20} /> 검색
    </Button>
    </div>
    
  );
}
