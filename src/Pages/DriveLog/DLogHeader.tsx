import { Folder } from "lucide-react";

export function DLogHeader() {
  return (
    <div className="w-full text-left">
      <div className="text-4xl font-bold flex items-center gap-3">
        <Folder size={36} /> 운행일지
      </div>
    </div>
  );
}
