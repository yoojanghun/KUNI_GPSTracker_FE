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
  const { applySearch } = useDLogStore.getState();

  useEffect(() => {
    // Helper: format Date -> 'YYYY-MM-DD'
    const toYMD = (d: Date) => {
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${y}-${m}-${day}`;
    };

    // Anchor to KST "today" (avoid local TZ drift)
    const now = new Date();
    const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
    const today = new Date(Date.UTC(kst.getUTCFullYear(), kst.getUTCMonth(), kst.getUTCDate()));
    const oneWeekAgo = new Date(today);
    oneWeekAgo.setUTCDate(today.getUTCDate() - 7);

    setStartTime(toYMD(oneWeekAgo));
    setEndTime(toYMD(today));
    applySearch();
  }, []);

  const isDateValid =
    (!startTime && !endTime) ||
    (!startTime && endTime) ||
    (startTime && !endTime) ||
    (startTime && endTime && startTime <= endTime);

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
              selected={startTime ? new Date(`${startTime}T00:00:00+09:00`) : undefined}
              captionLayout="dropdown"
              onSelect={(date) => {
                if (!date) return;
                const selected = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
                setStartTime(selected);
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
              selected={endTime ? new Date(`${endTime}T00:00:00+09:00`) : undefined}
              captionLayout="dropdown"
              onSelect={(date) => {
                if (!date) return;
                const selected = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
                setEndTime(selected);
                setOpenEnd(false);
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
