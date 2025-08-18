import { CarNumInput } from "@/components/DLogcomponents/CarNumInput";
import { DateSelection } from "@/components/DLogcomponents/DateSelection";
import { LogResetButton } from "@/components/DLogcomponents/LogResetButton";
import { LogSearchButton } from "@/components/DLogcomponents/LogSearchButton";

export function DLogInputs() {
  return (
    <div className="flex items-center justify-start gap-3">
      <CarNumInput />
      <DateSelection />
      <LogSearchButton />
      <LogResetButton />
    </div>
  )
}