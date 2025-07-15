import { useState, useEffect } from "react"
import { CalendarDays } from "lucide-react"
import { useDLogStore } from "@/Store/dlogStore"
import { cn } from "@/lib/utils"

import { Button } from "@/Components/ui/button"
import { Calendar } from "@/Components/ui/calendar"
import { Label } from "@/Components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/Components/ui/popover"

export function EndDateSelection() {
  const [open, setOpen] = useState(false)
  const [date, setDate] = useState<Date | undefined>(undefined)

  const filter = useDLogStore((state) => state.filter );
  const setFilter = useDLogStore((state) => state.setFilter );
  const isDateValid = useDLogStore((state) => state.isDateValid);
  const setIsDateValid = useDLogStore((state) => state.setIsDateValid);

  useEffect(() => {
    if (date) {
      const formatted = date.toLocaleDateString("sv-SE"); // "YYYY-MM-DD" 형식 보장
      console.log('end-formatted: ', formatted);
      setFilter({ ...filter, endTime: formatted })
    }
  }, [date])

  // 페이지 로드 시 true로 다시 초기화
  useEffect(() => {
  setIsDateValid(true);
}, []);

  return (
    <div>
      { isDateValid || date 
      ? <Label htmlFor="date" className="px-1 py-1 text-[#9E9E9E]">
        종료 날짜 
        </Label>
      : <Label htmlFor="date" className="px-1 py-1 text-red-500">
        날짜를 입력하세요 
        </Label>
      }
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date"
            className={cn("w-48 justify-between font-normal",
              !isDateValid && !date && "border-red-500"
            )}
          >
            {date ? date.toLocaleDateString() : "YYYY-MM-DD"}
            <CalendarDays />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            captionLayout="dropdown"
            onSelect={(date) => {
              setDate(date)
              setOpen(false)
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
