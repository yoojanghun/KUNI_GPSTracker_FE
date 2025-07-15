import { Button } from "@/Components/ui/button";
import { CircleAlert, Search } from "lucide-react";
import { useDLogStore } from "@/Store/dlogStore";
import { toast } from "sonner";

export function LogSearchButton() {
  const applyFilter = useDLogStore((state) => state.applyFilter);
  const filteredDLogs = useDLogStore((state) => state.filteredDLogs);
  const { carNumber, startTime, endTime } = useDLogStore(
    (state) => state.filter
  );

  return (
    <div className="flex flex-col">
      <span className="text-transparent">-</span>
      <Button
        onClick={() => {
          if (!carNumber && !startTime && !endTime) {
            toast("검색값을 입력해 주세요", {
              icon: <CircleAlert />,
            });
          }
          applyFilter();
          if (filteredDLogs.length <= 0) {
            toast("일치하는 기록이 없습니다", {
              icon: <CircleAlert />,
            });
          }
        }}
        className="bg-[#000000] gap-3 hover:bg-[#000000]/80"
      >
        <Search strokeWidth={3} size={20} /> 검색
      </Button>
    </div>
  );
}
