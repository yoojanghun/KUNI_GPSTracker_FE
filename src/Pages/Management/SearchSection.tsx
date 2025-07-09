import { SearchButton } from "@/Components/SearchButton";
import { DeleteButton } from "@/Components/DeleteButton";
import { StatusSelect } from "@/Components/StatusSelection";
import { SearchInput } from "@/Components/SearchInput";
import { AddCarButton } from "@/Components/AddCarButton";

export function SearchSection() {
    return (
        <div>
          <SearchInput/>
          <StatusSelect/>
          <SearchButton/>
          <DeleteButton/>
          <AddCarButton/>
        </div>
    );
}