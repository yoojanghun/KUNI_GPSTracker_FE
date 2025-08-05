import { Input } from "@/Components/ui/input";
import { useDLogStore } from "@/Store/dlogStore";

export function CarNumInput() {
  const { setVehicleNumber, vehicleNumber } = useDLogStore();
 
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVehicleNumber(e.target.value)
  };

  return (
    <div>
      <label className="px-1 py-1">
        
      </label>
      <Input
        type="text"
        value={vehicleNumber}
        onChange={handleChange}
        placeholder="차량 번호 검색"
        className="bg-[#FAFAFA] placeholder:text-[#DCDCDC]"
      />
    </div>
  );
}
