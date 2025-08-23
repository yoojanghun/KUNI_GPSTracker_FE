import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useCarStore } from "../../Store/carStore";

export function SearchButton() {
  const applySearch = useCarStore((state) => state.applySearch);

  return (
    <Button
      onClick={() => applySearch()}
      className="bg-[#000000] gap-3 hover:bg-[#000000]/80 cursor-pointer"
    >
      <Search strokeWidth={3} size={20} /> 검색
    </Button>
  );
}
