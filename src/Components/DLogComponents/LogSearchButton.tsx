import { Button } from "@/Components/ui/button";
import { CircleAlert, Search } from "lucide-react";
import { useDLogStore } from "@/Store/dlogStore";
import { toast } from "sonner";

export function LogSearchButton() {
  const fetchDLogs = useDLogStore((state) => state.fetchDLogs);
  const vehicleNumber = useDLogStore((state) => state.vehicleNumber);
  const dateValidation = useDLogStore((state) => state.dateValidation);
  const isDateValid = useDLogStore((state) => state.isDateValid);

  const tableRowHeight = 60;
  const itemsPerPage = Math.floor((window.innerHeight) / tableRowHeight);

  return (
    <div className="flex flex-col">
      <span className="text-transparent">-</span>
      <Button
        onClick={async () => {
          dateValidation();
          if (!vehicleNumber && !isDateValid) {
            toast("올바른 검색값을 입력해 주세요", {
              icon: <CircleAlert />,
            });
          } else {
            await fetchDLogs({
              size: itemsPerPage
            })
            const updatedLogs = useDLogStore.getState().DLogs;
            if (updatedLogs.length <= 0) {
              toast("일치하는 기록이 없습니다", {
                icon: <CircleAlert />,
              });
            }
          
          }
        }}
        className="bg-[#000000] gap-3 hover:bg-[#000000]/80"
      >
        <Search strokeWidth={3} size={20} /> 검색
      </Button>
    </div>
  );
}
