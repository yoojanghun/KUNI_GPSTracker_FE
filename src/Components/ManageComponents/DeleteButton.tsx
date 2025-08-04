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

import { useState } from "react";
import { carDeleteMany } from "../../Api/ManageApi/carDelete";
import { useCarStore } from "@/Store/carStore";

export function DeleteButton() {
  const [isOpen, setIsOpen] = useState(false);
  const selected = useCarStore((state) => state.selected);
  const fetchCars = useCarStore((state) => state.fetchCars);
  const clearSelected = useCarStore((state) => state.clearSelected);

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
        className="bg-[#FF4343] gap-3 hover:bg-[#FF4343]/80"
      >
        <Trash strokeWidth={3} size={20} /> 삭제
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
            onClick={async () => {
              await carDeleteMany(selectedArray, async () => {
                await fetchCars();
                clearSelected();
              });
              setIsOpen(false);
              toast(
                hiddenCount > 0 ? (
                  <span>
                    <strong>{selectedArray[0]}</strong> 외 
                    <strong> {hiddenCount}</strong>대 삭제 완료
                  </span>
                ) : (
                  <span>
                    <strong>{selectedArray[0]}</strong> 삭제 완료
                  </span>
                ),
                { icon: <FileX2 /> }
              );
            }}
          >
            확인
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
