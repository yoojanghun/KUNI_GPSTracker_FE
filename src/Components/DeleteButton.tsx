import { Button } from "@/Components/ui/button";
import { Trash } from "lucide-react";
import { useCarStore } from "../Store/carStore";

export function DeleteButton() {
  const deleteSelectedCars = useCarStore((state) => state.deleteSelectedCars);

  return (
    <Button
      onClick={deleteSelectedCars}
      className="bg-[#FF4343] gap-3 hover:bg-[#FF4343]/80"
    >
      <Trash strokeWidth={3} size={20} /> 삭제
    </Button>
  );
}
