import { HeaderSection } from "./HeaderSection";
import { SearchSection } from "./SearchSection";
import { CarTableSection } from "./CarTableSection";

export default function Management() {
    return (
        <div>
            <HeaderSection />
            <SearchSection />
            <CarTableSection />
        </div>
    );
}