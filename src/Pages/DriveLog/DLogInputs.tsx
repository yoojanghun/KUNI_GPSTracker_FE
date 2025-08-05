import { CarNumInput } from "@/Components/DLogComponents/CarNumInput";
import { DateSelection } from "@/Components/DLogComponents/DateSelection";
import { LogResetButton } from "@/Components/DLogComponents/LogResetButton";
import { LogSearchButton } from "@/Components/DLogComponents/LogSearchButton";

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