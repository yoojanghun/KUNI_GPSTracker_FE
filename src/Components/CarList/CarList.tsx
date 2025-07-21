import truck from "@/assets/car-list-icons/truck.png";
import searchGlass from "@/assets/car-list-icons/Search.png";
import arrowLeft from "@/assets/arrow-left.png";
import styles from "./CarList.module.css";
import { useEffect, useRef, useState } from "react";
import type { CarInfo } from "@/Store/carStatus"
import { useSelectCarStore } from "@/Store/carStatus";
import { useCarStatusOptionStore } from "@/Store/carStatus";

function CarList() {

    const setSelectedCar = useSelectCarStore(state => state.setSelectedCar);
    const selectedCar = useSelectCarStore(state => state.selectedCar);

    const setCarStatusOption = useCarStatusOptionStore(state => state.setCarStatusOption);
    const carStatusOption = useCarStatusOptionStore(state => state.carStatusOption);

    useEffect(() => {
        setCarStatusOption("전체");
    }, [])

    const [inputVal, setInputVal] = useState<string>("");
    const [currentCarList, setCurrentCarList] = useState<CarInfo[]>([])
    const [isVisible, setIsVisible] = useState<boolean>(true);

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

    if(selectedCar) {
        return (
             <section className={`${styles["car-list"]} border w-75 max-h-130 flex flex-col rounded-xl bg-white box-border p-3`}>
                <button className="flex items-center cursor-pointer" onClick={() => setSelectedCar(null)}>
                    <img src={arrowLeft} alt="뒤로가기 버튼" className="w-6 h-6 mr-2"/>
                    <span className="text-lg font-bold">뒤로 가기</span>
                </button>
                <p className="font-bold opacity-20 ml-1">
                    {selectedCar.number}
                </p>
                {isVisible && <table className="my-5">
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
                </table>}
                <button ref={hideBtnRef} 
                    onClick={() => {setIsVisible(!isVisible)}} 
                    className={`${styles["hide-btn"]} rounded-br-xl rounded-bl-xl h-6 border`}>
                    {isVisible ? "🔺" : "🔻"}
                </button>
            </section>
        )
    }
    
    return (
        <section className={`${styles["car-list"]} border w-75 max-h-130 flex flex-col rounded-xl bg-white box-border p-3`}>
            <h3 className="flex justify-between items-center font-bold text-xl mb-2 pr-1">
                <div className="flex items-center">
                    <img src={truck} alt="트럭 아이콘" className="mr-2" />
                    <span className="text-xl">차량 리스트</span>
                </div>
                <select onChange={e => setCarStatusOption(e.target.value)} value={carStatusOption} className="border-2 px-1 cursor-pointer">
                    <option value="전체">전체</option>
                    <option value="운행중">운행중</option>
                    <option value="미운행">미운행</option>
                    <option value="수리중">수리중</option>
                </select>
            </h3>

            <form action="#" onSubmit={e => e.preventDefault()} className="mb-3">
                <label className={`${styles["car-list__input"]} flex items-center border-none rounded px-2 py-1`}>
                    <img src={searchGlass} alt="검색 아이콘" className="w-4 h-4 mr-2" />
                    <input value={inputVal} onChange={handleInput} type="text" placeholder="차량 검색" className="w-full h-7 outline-none text-xl" />                        {inputVal && <button onClick={() => setInputVal("")} type="button" className="text-sm cursor-pointer opacity-30 mr-[3px]">X</button>}
                </label>
            </form>

                {/* car는 각 차량 객체 */}
            {isVisible && <ul className="flex-1 overflow-y-auto space-y-2 pr-2 min-h-105 pb-2">
                {filteredCarList.map(car => {
                    const iconSrc = carStatusClass[car.status];

                    return <li key={car.number} onClick={() => setSelectedCar(car)}
                                className={`${styles["car-list__item"]} flex items-center rounded-lg box-border px-2 py-2`}>
                                <span className={`p-1 px-2 font-bold mr-3 border text-sm rounded-sm ${iconSrc} min-w-[55px]`}>
                                    {car.status}
                                </span>
                                <p>
                                    <span className="font-bold">{car.number}</span> <br /> 
                                    <span className="opacity-50">{car.name}</span>
                                </p>
                        </li>
                    })
                }
            </ul>}
            <button ref={hideBtnRef} 
                onClick={() => {setIsVisible(!isVisible)}} 
                className={`${styles["hide-btn"]} rounded-br-xl rounded-bl-xl h-6 border`}>
                {isVisible ? "🔺" : "🔻"}
            </button>
        </section>
        
    );
}

export default CarList;