import { Input } from "@/Components/ui/input";
import { useDLogStore } from "@/Store/dlogStore";

export function CarNumInput() {
  const filter = useDLogStore((state) => state.filter);
  const setFilter = useDLogStore((state) => state.setFilter);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter({ ...filter, carNumber: e.target.value });
  };

  return (
    <div>
      <label className="px-1 py-1">
        
      </label>
      <Input
        type="text"
        value={filter.carNumber}
        onChange={handleChange}
        placeholder="차량 번호 검색"
        className="bg-[#FAFAFA] placeholder:text-[#DCDCDC]"
      />
    </div>
  );
}
