import { useState, useEffect } from "react"
import { CalendarDays } from "lucide-react"
import { useDLogStore } from "@/Store/dlogStore"

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

  useEffect(() => {
    if (date) {
      const formatted = date.toISOString().slice(0, 10)
      setFilter({ ...filter, startTime: formatted })
    }
  }, [date])


  return (
    <div>
      <Label htmlFor="date" className="px-1 py-1 text-[#9E9E9E]">
        종료 날짜
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date"
            className="w-48 justify-between font-normal"
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
