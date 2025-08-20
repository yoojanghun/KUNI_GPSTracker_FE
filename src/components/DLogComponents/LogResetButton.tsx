import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import { useDLogStore } from "@/Store/dlogStore";


export function LogResetButton() {
  const { applySearch } = useDLogStore.getState();
  const setVehicleNumber = useDLogStore((state) => state.setVehicleNumber);
  const setStartTime = useDLogStore((state) => state.setStartTime);
  const setEndTime = useDLogStore((state) => state.setEndTime);

  return (
    <div className="flex flex-col">
      <span className="text-transparent">-</span>
      <Button
        onClick={async () => {
            setVehicleNumber("");
            setStartTime("");
            setEndTime("");
            applySearch();
          }}
        className="bg-[#717171] gap-3 hover:bg-[#717171]/80 cursor-pointer"
        
      >
        <RotateCcw strokeWidth={3} size={20} /> 초기화
      </Button>
    </div>
  );
}
