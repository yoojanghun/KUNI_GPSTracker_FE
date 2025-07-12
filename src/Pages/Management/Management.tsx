import { HeaderSection } from "./HeaderSection";
import { SearchSection } from "./SearchSection";
import { CarTableSection } from "./CarTableSection";

export default function Management() {
    return (
        <div className="flex flex-col gap-6 px-8 py-4 w-full max-w-7xl mx-auto">
            <HeaderSection />
            <SearchSection />
            <CarTableSection />
        </div>
    );
}