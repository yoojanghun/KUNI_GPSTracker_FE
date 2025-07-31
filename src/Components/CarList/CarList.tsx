import { 
    Search, 
    Truck, 
    ArrowLeft,
    ChevronDown,
    ChevronUp,
    X,
    Folder
} from "lucide-react";  
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";  
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
    PaginationDoublePrevious,
    PaginationDoubleNext
} from "@/Components/ui/pagination"
import {
    type CarInfo,
    useSelectCarStore, 
    useCarStatusOptionStore, 
    useTrackCarStore,  
    usePaginationStore
} from "@/Store/carStatus";
import { useDLogStore } from "@/Store/dlogStore";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./CarList.module.css";

function CarList() {

    const setSelectedCar = useSelectCarStore(state => state.setSelectedCar);
    const selectedCar = useSelectCarStore(state => state.selectedCar);

    const setMapCenterCarList = useTrackCarStore(state => state.setMapCenterCarList);
    const setMapLevelCarList = useTrackCarStore(state => state.setMapLevelCarList);

    const setCarStatusOption = useCarStatusOptionStore(state => state.setCarStatusOption);
    const carStatusOption = useCarStatusOptionStore(state => state.carStatusOption);

    const page = usePaginationStore(state => state.page);
    const setPage = usePaginationStore(state => state.setPage);
    const totalPages = 72;                                              // 백엔드에서 제공 예정

    const [inputVal, setInputVal] = useState<string>("");
    const [currentCarList, setCurrentCarList] = useState<CarInfo[]>([])
    const [isVisible, setIsVisible] = useState<boolean>(true);

    const navigate = useNavigate();
    const filter = useDLogStore((state) => state.filter);
    const setFilter = useDLogStore((state) => state.setFilter);

    const hideBtnRef = useRef<HTMLButtonElement | null>(null);

    const carStatusClass: Record<string, string> = {
        "운행중": "bg-[#c1d8ff] text-[#5491f5]",
        "미운행": "bg-[#ffcac6] text-[#e94b3e]",
        "수리중": "bg-[#ffe4be] text-[#ffa62a]"
    }

    useEffect(() => {
        fetch("/carListExample.json")
        .then(res => res.json())
        .then(data => setCurrentCarList(data));
    }, [])

    // carList 목록에 보여지는 차량들
    const filteredCarList = currentCarList.filter((car) => {            
        const keyword = inputVal.trim().toLowerCase();

        const matchesKeyWord = car["name"].trim().toLowerCase().includes(keyword) || 
                                car["number"].trim().toLowerCase().includes(keyword);

        const matchesStatus = car["status"] === carStatusOption || carStatusOption === "전체";

        return matchesKeyWord && matchesStatus;
    })

    function handleInput(event: React.ChangeEvent<HTMLInputElement>) {
        setInputVal(event.target.value);

        const keyword = event.target.value.trim().toLowerCase();
        const isMatchingCar = filteredCarList.filter((car) => {
            return car["name"].trim().toLowerCase().includes(keyword) || 
                    car["number"].trim().toLowerCase().includes(keyword);
        })
        if(isMatchingCar.length > 0 && keyword !== "") {
            setIsVisible(true);
        }
    }

    // pagination 시 화면에 보이는 페이지 설정
    const allPages = [...Array(totalPages)].map((_, i) => i + 1);       // [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]        

    let visiblePages: number[] = [];

    if(totalPages <= 5) {
        visiblePages = allPages;
    }
    else if(page <= 3) {
        visiblePages = allPages.slice(0, 5);            // 처음 5개 페이지
    }
    else if(page >= totalPages - 2){
        visiblePages = allPages.slice(totalPages - 5)   // 마지막 5개 페이지
    }
    else{
        visiblePages = allPages.slice(page - 3, page + 2);
    }

    if(selectedCar) {
        return (
            <section className={`${styles["car-list"]} border w-75 max-h-130 flex flex-col rounded-xl bg-white box-border p-3`}>
                <div className="flex justify-between items-center font-bold text-xl pr-1">
                    <button className="flex items-center cursor-pointer" onClick={() => setSelectedCar(null)}>
                        <ArrowLeft className="w-6 h-6 mr-2"/>
                        <span className="text-lg font-bold">뒤로 가기</span>
                    </button>
                    <Select value={carStatusOption} onValueChange={setCarStatusOption}>
                    <SelectTrigger className="border-2 px-1 cursor-pointer rounded-sm min-w-[85px]">
                        <SelectValue placeholder="전체" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="전체">전체</SelectItem>
                        <SelectItem value="운행중">운행중</SelectItem>
                        <SelectItem value="미운행">미운행</SelectItem>
                        <SelectItem value="수리중">점검중</SelectItem>
                    </SelectContent>
                </Select>
                </div>
                <p className="font-bold opacity-20 ml-1">
                    {selectedCar.number}
                </p>
                {isVisible && 
                    <>
                        <table className="my-5">
                            <tbody>
                                <tr>
                                    <th className={styles["th"]}>차량번호</th>
                                    <td className={styles["td"]}>{selectedCar.number}</td>
                                </tr>
                                <tr>
                                    <th className={styles["th"]}>차량명</th>
                                    <td className={styles["td"]}>{selectedCar.name}</td>
                                </tr>
                                <tr>
                                    <th className={styles["th"]}>상태</th>
                                    <td className={styles["td"]}>
                                        <span className={`p-1 px-2 font-bold border text-sm rounded-sm 
                                                        ${carStatusClass[selectedCar.status]} min-w-[55px]`}>
                                            {selectedCar.status}
                                        </span>
                                    </td>
                                </tr>
                                <tr>
                                    <th className={styles["th"]}>운행일자</th>
                                    <td className={styles["td"]}>데이터 없음</td>
                                </tr>
                                <tr>
                                    <th className={styles["th"]}>운행시간</th>
                                    <td className={styles["td"]}>데이터 없음</td>
                                </tr>
                                <tr>
                                    <th className={styles["th"]}>운행 거리</th>
                                    <td className={styles["td"]}>{selectedCar.mileage}</td>
                                </tr>
                            </tbody>
                        </table>
                        <button 
                            onClick={() => {navigate("/log"); setFilter({...filter, carNumber: `${selectedCar.number}`});}}
                            className="border cursor-pointer font-bold py-1 rounded-sm flex justify-center items-center">
                                <Folder className="mr-1"/>
                                운행일지 이동
                        </button>
                    </>}
                <button ref={hideBtnRef} 
                    onClick={() => {setIsVisible(!isVisible)}} 
                    className={`${styles["hide-btn"]} rounded-br-xl rounded-bl-xl h-6 border flex justify-center`}>
                    {isVisible ? <ChevronUp /> : <ChevronDown />}
                </button>
            </section>
        )
    }
    
    return (
        <section className={`${styles["car-list"]} border w-80 max-h-145 flex flex-col rounded-xl bg-white box-border p-3`}>
            <h3 className="flex justify-between items-center font-bold text-xl mb-2 pr-1">
                <div className="flex items-center">
                    <Truck className="mr-2" />
                    <span className="text-xl">차량 리스트</span>
                </div>
                <Select value={carStatusOption} onValueChange={setCarStatusOption}>
                    <SelectTrigger className="border-2 px-1 cursor-pointer rounded-sm min-w-[85px]">
                        <SelectValue placeholder="전체" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="전체" className="cursor-pointer">전체</SelectItem>
                        <SelectItem value="운행중" className="cursor-pointer">운행중</SelectItem>
                        <SelectItem value="미운행" className="cursor-pointer">미운행</SelectItem>
                        <SelectItem value="수리중" className="cursor-pointer">점검중</SelectItem>
                    </SelectContent>
                </Select>
            </h3>

            <form action="#" onSubmit={e => e.preventDefault()} className="mb-3">
                <label className={`${styles["car-list__input"]} flex items-center border-none rounded px-2 py-1`}>
                    <Search className="w-4 h-4 mr-2" />
                    <input value={inputVal} onChange={handleInput} type="text" placeholder="차량 검색" className="w-full h-7 outline-none text-xl" />                        
                    {inputVal && 
                        <button onClick={() => setInputVal("")} 
                                type="button" 
                                className="text-sm cursor-pointer opacity-30 mr-[3px] hover:bg-gray-400 rounded-full">
                                    <X />
                        </button>}
                </label>
            </form>

            {/* car는 각 차량 객체 */}
            {isVisible && (
                <>
                    <ul className="flex-1 overflow-y-auto space-y-2 pr-2 min-h-105 pb-2">
                        {filteredCarList.map(car => {
                            if (!car.path) return null;
                            const iconSrc   = carStatusClass[car.status];
                            const lastPoint = car.path[car.path.length - 1];
                            return (
                                <li key={car.number}
                                    onClick={() => {
                                        setMapCenterCarList({ lat: lastPoint.lat, lng: lastPoint.lng });
                                        setMapLevelCarList(2);
                                        setSelectedCar(car);}}
                                    className={`${styles["car-list__item"]} flex items-center rounded-lg box-border px-2 py-1.5`}>
                                    <span className={`p-1 px-2 font-bold mr-3 border text-sm rounded-sm ${iconSrc} min-w-[55px]`}>
                                        {car.status}
                                    </span>
                                    <div>
                                        <div className="font-bold h-5">{car.number}</div>
                                        <div className="opacity-50 h-5">{car.name}</div>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                    <Pagination className="mt-1">
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationDoublePrevious
                                    href="#"
                                    onClick={() => page > 5 && setPage(page - 5)}
                                    className="w-6 h-8 flex items-center justify-center cursor-pointer">
                                </PaginationDoublePrevious>
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationPrevious 
                                    href="#"
                                    onClick={() => page > 1 && setPage(page - 1)}
                                    aria-disabled={page === 1} 
                                    className="w-6 h-8 flex items-center justify-center" />
                            </PaginationItem>
                            {visiblePages.map((p) => (                       // [4, 5, 6, 7, 8]
                                <PaginationItem>
                                    <PaginationLink
                                        href="#"
                                        onClick={() => setPage(p)}
                                        isActive={page === p}
                                        className="w-8 h-8" >
                                            {p}
                                    </PaginationLink>
                                </PaginationItem>
                                ))
                            }
                            <PaginationItem>
                                <PaginationNext 
                                    href="#"
                                    onClick={() => page < totalPages && setPage(page + 1)}
                                    aria-disabled={page === totalPages} 
                                    className="w-6 h-8 flex items-center justify-center" />
                            </PaginationItem>
                                <PaginationDoubleNext
                                    href="#"
                                    onClick={() => page < totalPages - 5 && setPage(page + 5)}
                                    className="w-6 h-8 flex items-center justify-center cursor-pointer">
                                </PaginationDoubleNext>
                        </PaginationContent>
                    </Pagination>
                </>
            )}

            <button ref={hideBtnRef} 
                onClick={() => {setIsVisible(!isVisible)}} 
                className={`${styles["hide-btn"]} rounded-br-xl rounded-bl-xl h-6 border flex justify-center`}>
                {isVisible ? <ChevronUp /> : <ChevronDown />}
            </button>
        </section>
    );
}

export default CarList;