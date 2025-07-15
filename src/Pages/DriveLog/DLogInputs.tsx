import { CarNumInput } from "@/Components/DLogComponents/CarNumInput";
import { StartDateSelection } from "@/Components/DLogComponents/StartDateSelection";
import { EndDateSelection } from "@/Components/DLogComponents/EndDateSelection";
import { LogSearchButton } from "@/Components/DLogComponents/LogSearchButton";

export function DLogInputs() {
  return (
    <div className="flex items-center justify-start gap-3">
      <CarNumInput />
      <StartDateSelection />
      <EndDateSelection />
      <LogSearchButton />
    </div>
  )
}