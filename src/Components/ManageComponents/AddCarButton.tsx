import { useState } from "react";
import { Button } from "@/Components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/Components/ui/dialog";

import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { CircleCheck, CircleX, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { carRegist } from "@/Api/ManageApi/carRegist";

export function AddCarButton() {
  const [inputDialog, setInputDialog] = useState(false);
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [vehicleName, setVehicleName] = useState("");
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);

  // TODO: react-hook-form 도입 고려 (리펙토링 시)
  // 입력값 유효성 검사
  const isvehicleNumberValid = () => {
    return vehicleNumber.trim() !== ""; // && ;
  };
  const isModelNameValid = () => {
    return vehicleName.trim() !== ""; // && ;
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
                  htmlFor="vehicleNumber"
                  className={
                    attemptedSubmit && !isvehicleNumberValid()
                      ? "text-red-500 font-semibold"
                      : ""
                  }
                >
                  {attemptedSubmit && !isvehicleNumberValid()
                    ? "차량 번호를 입력해주세요"
                    : "차량 번호"}
                </Label>
                <Input
                  id="vehicleNumber"
                  name="vehicleNumber"
                  placeholder="예: 34나3434"
                  className={cn(
                    "placeholder:text-[#ACACAC]",
                    attemptedSubmit &&
                      !isvehicleNumberValid() &&
                      "border-red-500"
                  )}
                  value={vehicleNumber}
                  onChange={(e) => setVehicleNumber(e.target.value)}
                />
              </div>
              <div className="grid gap-3">
                <Label
                  htmlFor="vehicleName"
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
                  id="vehicleName"
                  name="vehicleName"
                  placeholder="예: Genesis GV80"
                  className={cn(
                    "placeholder:text-[#ACACAC]",
                    attemptedSubmit && !isModelNameValid() && "border-red-500"
                  )}
                  value={vehicleName}
                  onChange={(e) => setVehicleName(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                className="bg-[#8D99FF] gap-3 hover:bg-[#8D99FF]/80"
                onClick={async () => {
                  setAttemptedSubmit(true);
                  if (isvehicleNumberValid() && isModelNameValid()) {
                    setInputDialog(false);
                    const res = await carRegist({
                      vehicleNumber,
                      vehicleName,
                    });
                    setAttemptedSubmit(false);
                    if (
                      vehicleName === res.vehicleName &&
                      vehicleNumber === res.vehicleNumber
                    ) {
                      toast(
                        <span>
                          <strong>{vehicleNumber}</strong> 차량이
                          등록되었습니다.
                        </span>,
                        {
                          icon: <CircleCheck />,
                        }
                      );
                    } else {
                      toast(
                        <span>
                          서버 오류로 인해 차량 등록에 실패하였습니다.
                        </span>,
                        {
                          icon: <CircleX />,
                        }
                      );
                    }

                    setVehicleNumber("");
                    setVehicleName("");
                  }
                }}
              >
                입력 완료
              </Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Dialog>
    </>
  );
}
