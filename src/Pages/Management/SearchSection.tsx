import { SearchButton } from "@/Components/SearchButton";
import { DeleteButton } from "@/Components/DeleteButton";
import { StatusSelect } from "@/Components/StatusSelection";
import { SearchInput } from "@/Components/SearchInput";
import { AddCarButton } from "@/Components/AddCarButton";

export function SearchSection() {
  return (
    <div className="w-full flex justify-between items-center">
      <div className="flex items-center gap-3">
        <SearchInput />
        <StatusSelect />
        <SearchButton />
        <DeleteButton />
      </div>

      <AddCarButton />
    </div>
  );
}
