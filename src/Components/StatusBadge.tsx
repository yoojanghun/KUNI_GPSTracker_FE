import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
}

const statusColorMap: Record<StatusBadgeProps["status"], string> = {
  미운행: "bg-[#FFCAC6] text-[#E94B3E]",
  운행중: "bg-[#C1D8FF] text-[#5491F5]",
  수리중: "bg-[#FFE4BE] text-[#FFA62A]",
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "px-2 py-1 rounded-sm text-sm font-semibold",
        statusColorMap[status]
      )}
    >
      {status}
    </span>
  );
}