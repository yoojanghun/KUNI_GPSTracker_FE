import { SearchButton } from "@/components/Managecomponents/SearchButton";
import { DeleteButton } from "@/components/Managecomponents/DeleteButton";
import { StatusSelect } from "@/components/Managecomponents/StatusSelection";
import { SearchInput } from "@/components/Managecomponents/SearchInput";
import { AddCarButton } from "@/components/Managecomponents/AddCarButton";

export function ManageInputs() {
  return (
    <div className="w-full flex justify-between items-center">
      <div className="flex items-center gap-3">
        <SearchInput />
        <StatusSelect />
        <SearchButton />
      </div>

      <div className="flex gap-3">
      <AddCarButton />
      <DeleteButton />
      </div>

    </div>
  );
}
