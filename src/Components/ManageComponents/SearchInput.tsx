import { Input } from "@/Components/ui/input";
import { useCarStore } from "../../Store/carStore";

export function SearchInput() {
  const filter = useCarStore((state) => state.filter);
  const setFilter = useCarStore((state) => state.setFilter);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter({ ...filter, carNumber: e.target.value });
  };

  return (
    <Input
      type="text"
      value={filter.carNumber}
      onChange={handleChange}
      placeholder="차량번호로 검색"
      className="bg-[#FAFAFA] placeholder:text-[#DCDCDC]"
    />
  );
}
