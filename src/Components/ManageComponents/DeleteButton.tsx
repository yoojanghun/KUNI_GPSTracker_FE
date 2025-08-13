import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import { CircleAlert, FileX2, Trash } from "lucide-react";
import { toast } from "sonner";

import { useRef, useState } from "react";
import { useCarStore } from "@/Store/carStore";
import { useDeleteManyCarsMutation } from "@/Queries/useDeleteCarsQuery";

export function DeleteButton() {
  const [isOpen, setIsOpen] = useState(false);
  const selected = useCarStore((state) => state.selected);

  const deleteTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const delMany = useDeleteManyCarsMutation();

  const selectedArray = Array.from(selected);
  const showItems = selectedArray.slice(0, 2);
  const hiddenCount = selectedArray.length - showItems.length;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Button
        onClick={() => {
          if (selected.size > 0) setIsOpen(true);
          else toast("삭제할 차량을 선택해 주세요", { icon: <CircleAlert /> });
        }}
        className=" bg-[#FF4343] gap-3 hover:bg-[#FF4343]/80 whitespace-nowrap font-mono [font-variant-numeric:tabular-nums]"
        disabled={delMany.isPending}
      >
        <Trash strokeWidth={3} size={20} /> 삭제 ({selected.size})
      </Button>

      <DialogContent className="w-[25%]">
        <DialogHeader>
          <DialogTitle>차량을 삭제하시겠습니까?</DialogTitle>
        </DialogHeader>
        <ul>
          {showItems.map((car, idx) => (
            <li key={idx}>• {car}</li>
          ))}
          {hiddenCount > 0 && <li>• 외 {hiddenCount}대</li>}
        </ul>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            취소
          </Button>
          <Button
            className="bg-[#8D99FF] gap-3 hover:bg-[#8D99FF]/80"
            onClick={() => {
              // Take a snapshot of the current selection for accurate toast
              const toDelete = Array.from(selected);
              const toDeleteShow = toDelete.slice(0, 2);
              const toDeleteHidden = toDelete.length - toDeleteShow.length;

              setIsOpen(false);
              toast("차량 삭제 중..", {
                action: {
                  label: "되돌리기",
                  onClick: () => {
                    if (deleteTimerRef.current) {
                      clearTimeout(deleteTimerRef.current);
                      toast("삭제가 취소되었습니다");
                    }
                  },
                },
              });

              deleteTimerRef.current = setTimeout(() => {
                delMany.mutate(toDelete, {
                  onSuccess: () => {
                    toast(
                      toDeleteHidden > 0 ? (
                        <span>
                          <strong>{toDelete[0]}</strong> 외
                          <strong> {toDeleteHidden}</strong>대 삭제 완료
                        </span>
                      ) : (
                        <span>
                          <strong>{toDelete[0]}</strong> 삭제 완료
                        </span>
                      ),
                      { icon: <FileX2 /> }
                    );
                  },
                  onError: () => {
                    toast("삭제에 실패했습니다", { icon: <CircleAlert /> });
                  },
                });
              }, 3000);
            }}
            disabled={delMany.isPending}
          >
            확인
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
