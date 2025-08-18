import { SearchButton } from "@/components/ManageComponents/SearchButton";
import { DeleteButton } from "@/components/ManageComponents/DeleteButton";
import { StatusSelect } from "@/components/ManageComponents/StatusSelection";
import { SearchInput } from "@/components/ManageComponents/SearchInput";
import { AddCarButton } from "@/components/ManageComponents/AddCarButton";

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
