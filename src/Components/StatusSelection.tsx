// import * as React from "react"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select"

export function StatusSelect() {
  return (
    <div className="w-[110px]">
    <Select>
      <SelectTrigger className="px-3 py-4">
        <SelectValue placeholder="현황"/>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="on">운행중</SelectItem>
          <SelectItem value="off">미운행</SelectItem>
          <SelectItem value="reform">점검중</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
    </div>
    
  )
}
