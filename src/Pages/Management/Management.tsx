import { ManageHeader } from "./ManageHeader";
import { ManageInputs } from "./ManageInputs";
import { ManageTable } from "./ManageTable";

export default function Management() {
    return (
        <div className="flex flex-col gap-6 px-8 py-8 w-full max-w-7xl mx-auto">
            <ManageHeader />
            <ManageInputs />
            <ManageTable />
        </div>
    );
}