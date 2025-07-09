import { Wrench } from "lucide-react";

export function HeaderSection() {
  return (
    <div className="text-4xl font-bold flex items-center gap-3">
      <Wrench size={36}/> 차량 관리
    </div>
  );
}