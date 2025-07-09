import { HeaderSection } from "./HeaderSection";
import { SearchSection } from "./SearchSection";
import { PaginationSection } from "./PaginationSection";
import { CarTableSection } from "./CarTableSection";

export default function Management() {
    return (
        <div>
            <HeaderSection />
            <SearchSection />
            <CarTableSection />
            <PaginationSection />
        </div>
    );
}