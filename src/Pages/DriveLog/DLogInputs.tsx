import { CarNumInput } from "@/components/DLogComponents/CarNumInput";
import { DateSelection } from "@/components/DLogComponents/DateSelection";
import { LogResetButton } from "@/components/DLogComponents/LogResetButton";
import { LogSearchButton } from "@/components/DLogComponents/LogSearchButton";

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