import { Button } from "@/Components/ui/button";
import { RotateCcw } from "lucide-react";
import { useDLogStore } from "@/Store/dlogStore";


export function LogResetButton() {
  const fetchDLogs = useDLogStore((state) => state.fetchDLogs);
  const setVehicleNumber = useDLogStore((state) => state.setVehicleNumber);
  const setStartTime = useDLogStore((state) => state.setStartTime);
  const setEndTime = useDLogStore((state) => state.setEndTime);

  const tableRowHeight = 70;
  const itemsPerPage = Math.floor((window.innerHeight) / tableRowHeight);

  return (
    <div className="flex flex-col">
      <span className="text-transparent">-</span>
      <Button
        onClick={async () => {
            setVehicleNumber("");
            setStartTime("");
            setEndTime("");
            await fetchDLogs({
              size: itemsPerPage
            })
          }}
        className="bg-[#717171] gap-3 hover:bg-[#717171]/80"
        
      >
        <RotateCcw strokeWidth={3} size={20} /> 초기화
      </Button>
    </div>
  );
}
