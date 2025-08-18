import { Input } from "@/components/ui/input";
import { useCarStore } from "../../Store/carStore";

export function SearchInput() {
  const { setVehicleName, vehicleName } = useCarStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVehicleName(e.target.value);
  };

  return (
    <Input
      type="text"
      value={vehicleName}
      onChange={handleChange}
      placeholder="차량번호로 검색"
      className="bg-[#FAFAFA] placeholder:text-[#DCDCDC]"
    />
  );
}
