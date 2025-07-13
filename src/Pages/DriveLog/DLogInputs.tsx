import { CarNumInput } from "@/Components/DLogComponents/CarNumInput";
import { DateSelection } from "@/Components/DLogComponents/DateSelection";
import { LogSearchButton } from "@/Components/DLogComponents/LogSearchButton";

export function DLogInputs() {
  return (
    <div className="w-full flex justify-between items-center gap-3">
      <CarNumInput />
      <DateSelection />
      <LogSearchButton />
    </div>
  )
}