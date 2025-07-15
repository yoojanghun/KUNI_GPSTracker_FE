import { DLogHeader } from "./DLogHeader";
import { DLogInputs } from "./DLogInputs";
import { DLogTable } from "./DLogTable";

function DrivingLog() {
    return (
            <div className="flex flex-col gap-6 px-8 py-8 w-full max-w-7xl mx-auto">
                <DLogHeader />
                <DLogInputs />
                <DLogTable />
            </div>
        );
}

export default DrivingLog;