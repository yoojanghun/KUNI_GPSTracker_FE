import { useState } from "react";
import { Button } from "@/Components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/Components/ui/dialog";

import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { CircleCheck, Plus } from "lucide-react";
import { useCarStore } from "../../Store/carStore";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function AddCarButton() {
  const [inputDialog, setInputDialog] = useState(false);
  const [checkDialog, setCheckDialog] = useState(false);
  const [carNum, setCarNum] = useState("");
  const [modelName, setModelName] = useState("");
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);
  const addCar = useCarStore((state) => state.addCar);

  // TODO: react-hook-form 도입 고려 (리펙토링 시)
  // 입력값 유효성 검사
  const isCarNumValid = () => {
    return carNum.trim() !== ""; // && ;
  };
  const isModelNameValid = () => {
    return modelName.trim() !== ""; // && ;
  };

  return (
    <>
      <Dialog open={inputDialog} onOpenChange={setInputDialog}>
        <form>
          <DialogTrigger asChild>
            <Button
              className="bg-[#8D99FF] gap-3 hover:bg-[#8D99FF]/80"
              onClick={() => {}}
            >
              <Plus strokeWidth={3} size={20} />
              차량 등록
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>신규차량 등록하기</DialogTitle>
              <DialogDescription>
                새 차량을 등록하기 위해 아래의 정보를 입력해 주세요
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4">
              <div className="grid gap-3">
                <Label
                  htmlFor="carNum"
                  className={
                    attemptedSubmit && !isCarNumValid()
                      ? "text-red-500 font-semibold"
                      : ""
                  }
                >
                  {attemptedSubmit && !isCarNumValid()
                    ? "차량 번호를 입력해주세요"
                    : "차량 번호"}
                </Label>
                <Input
                  id="carNum"
                  name="carNum"
                  placeholder="예: 34나3434"
                  className={cn(
                    "placeholder:text-[#ACACAC]",
                    attemptedSubmit && !isCarNumValid() && "border-red-500"
                  )}
                  value={carNum}
                  onChange={(e) => setCarNum(e.target.value)}
                />
              </div>
              <div className="grid gap-3">
                <Label
                  htmlFor="modelName"
                  className={
                    attemptedSubmit && !isModelNameValid()
                      ? "text-red-500 font-semibold"
                      : ""
                  }
                >
                  {attemptedSubmit && !isModelNameValid()
                    ? "차량명을 입력해주세요"
                    : "차량명"}
                </Label>
                <Input
                  id="modelName"
                  name="modelName"
                  placeholder="예: Genesis GV80"
                  className={cn(
                    "placeholder:text-[#ACACAC]",
                    attemptedSubmit && !isModelNameValid() && "border-red-500"
                  )}
                  value={modelName}
                  onChange={(e) => setModelName(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                className="bg-[#8D99FF] gap-3 hover:bg-[#8D99FF]/80"
                onClick={() => {
                  setAttemptedSubmit(true);
                  if (isCarNumValid() && isModelNameValid()) {
                    setInputDialog(false);
                    setCheckDialog(true);
                  }
                }}
              >
                입력 완료
              </Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Dialog>
      <Dialog open={checkDialog} onOpenChange={setCheckDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>차량 정보를 확인해 주세요</DialogTitle>
            <DialogDescription>
              <ul>
                <li>차량 번호: {carNum}</li>
                <li>차량명: {modelName}</li>
              </ul>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                variant={"outline"}
                type="button"
                onClick={() => {
                  setInputDialog(true);
                }}
              >
                다시 입력
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button
                type="submit"
                className="bg-[#8D99FF] gap-3 hover:bg-[#8D99FF]/80"
                onClick={() => {
                  addCar({
                    number: carNum,
                    name: modelName,
                    mileage: 0,
                    status: "미운행",
                  });
                  setInputDialog(false);
                  setCheckDialog(false);
                  setAttemptedSubmit(false);
                  toast(
                    <span>
                      <strong>{carNum}</strong> 차량이 등록되었습니다.
                    </span>,{
                      icon: <CircleCheck />
                    }
                  )
                  setCarNum("");
                  setModelName("");
                }}
              >
                등록
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
