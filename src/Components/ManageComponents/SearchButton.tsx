import { Button } from "@/Components/ui/button";
import { Search } from "lucide-react";
import { useCarStore } from "../../Store/carStore";

export function SearchButton() {
  const applyFilter = useCarStore((state) => state.applyFilter);

  return (
    <Button
      onClick={applyFilter}
      className="bg-[#000000] gap-3 hover:bg-[#000000]/80"
    >
      <Search strokeWidth={3} size={20} /> 검색
    </Button>
  );
}
