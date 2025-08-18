import { useDLogStore } from "@/Store/dlogStore";
import { Calendar } from "@/Components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/Components/ui/popover";
import { Button } from "@/Components/ui/button";
import { Label } from "@/Components/ui/label";
import { CalendarDays } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export function DateSelection() {
  const startTime = useDLogStore((state) => state.startTime);
  const endTime = useDLogStore((state) => state.endTime);
  const setStartTime = useDLogStore((state) => state.setStartTime);
  const setEndTime = useDLogStore((state) => state.setEndTime);

  useEffect(() => {
    const today = new Date();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(today.getDate() - 7);

    setStartTime(oneWeekAgo.toLocaleDateString());
    setEndTime(today.toLocaleDateString());
  }, []);

  // Date validation: startTime must be before or equal endTime, or both empty
  const isDateValid =
    (!startTime && !endTime) ||
    (!startTime && endTime) ||
    (startTime && !endTime) ||
    (startTime && endTime && new Date(startTime) <= new Date(endTime));

  const [openStart, setOpenStart] = useState(false);
  const [openEnd, setOpenEnd] = useState(false);

  return (
    <div className="flex gap-4">
      <div key={"startSelection"}>
        {isDateValid || startTime ? (
          <Label htmlFor="date" className="px-1 py-1 text-[#9E9E9E]">시작 날짜</Label>
        ) : (
          <span className="text-transparent">-</span>
        )}
        <Popover open={openStart} onOpenChange={setOpenStart}>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              id="date"
              className={cn(
                "w-48 justify-between font-normal",
                !isDateValid && !startTime && "border-red-500"
              )}
            >
              {startTime || "YYYY-MM-DD"}
              <CalendarDays />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={startTime ? new Date(startTime) : undefined}
              captionLayout="dropdown"
              onSelect={(date) => {
                if (!date) return;
                const selected = date.toLocaleDateString();
                if (selected === startTime) {
                  setStartTime("");
                } else {
                  setStartTime(selected);
                }
                setOpenStart(false);
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
      <div key={"endSelection"}>
        {isDateValid || endTime ? (
          <Label htmlFor="date" className="px-1 py-1 text-[#9E9E9E]">종료 날짜</Label>
        ) : (
          <span className="text-transparent">-</span>
        )}
        <Popover open={openEnd} onOpenChange={setOpenEnd}>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              id="date"
              className={cn(
                "w-48 justify-between font-normal",
                !isDateValid && !endTime && "border-red-500"
              )}
            >
              {endTime || "YYYY-MM-DD"}
              <CalendarDays />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={endTime ? new Date(endTime) : undefined}
              captionLayout="dropdown"
              onSelect={(date) => {
                if (!date) return;
                const selected = date.toLocaleDateString();
                if (selected === endTime) {
                  setEndTime("");
                } else {
                  setEndTime(selected);
                }
                setOpenEnd(false);
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
