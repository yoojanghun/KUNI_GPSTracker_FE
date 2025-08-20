import { Button } from "@/components/ui/button";
import { CircleAlert, Search } from "lucide-react";
import { useDLogStore } from "@/Store/dlogStore";
import { toast } from "sonner";

export function LogSearchButton() {
  const vehicleNumber = useDLogStore((state) => state.vehicleNumber);
  const dateValidation = useDLogStore((state) => state.dateValidation);
  const isDateValid = useDLogStore((state) => state.isDateValid);
  const { applySearch } = useDLogStore.getState();

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
            applySearch();
            // const updatedLogs = useDLogStore.getState().DLogs;
            // if (updatedLogs.length <= 0) {
            //   toast("일치하는 기록이 없습니다", {
            //     icon: <CircleAlert />,
            //   });
            // }
          
          }
        }}
        className="bg-[#000000] gap-3 hover:bg-[#000000]/80 cursor-pointer"
      >
        <Search strokeWidth={3} size={20} /> 검색
      </Button>
    </div>
  );
}
