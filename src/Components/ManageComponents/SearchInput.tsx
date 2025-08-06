import { Input } from "@/Components/ui/input";
import { useCarStore } from "../../Store/carStore";

export function SearchInput() {
  const { setVehicleNumber, vehicleNumber } = useCarStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVehicleNumber(e.target.value);
  };

  return (
    <Input
      type="text"
      value={vehicleNumber}
      onChange={handleChange}
      placeholder="차량번호로 검색"
      className="bg-[#FAFAFA] placeholder:text-[#DCDCDC]"
    />
  );
}
