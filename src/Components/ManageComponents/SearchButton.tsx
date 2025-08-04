import { Button } from "@/Components/ui/button";
import { Search } from "lucide-react";
import { useCarStore } from "../../Store/carStore";

export function SearchButton() {
  const fetchCars = useCarStore((state) => state.fetchCars);

  return (
    <Button
      onClick={() => { fetchCars(0) }}
      className="bg-[#000000] gap-3 hover:bg-[#000000]/80"
    >
      <Search strokeWidth={3} size={20} /> 검색
    </Button>
  );
}
