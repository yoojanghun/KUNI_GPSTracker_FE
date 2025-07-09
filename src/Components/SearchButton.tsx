import { Button } from "@/Components/ui/button"
import { Search } from "lucide-react";

export function SearchButton() {
  return (
      <Button className="bg-[#000000] gap-3 hover:bg-[#000000]/80">
        <Search strokeWidth={3} size={20} /> 검색
      </Button>
  )
}
