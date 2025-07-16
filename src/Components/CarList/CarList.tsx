import truck from "../../assets/car-list-icons/truck.png";
import searchGlass from "../../assets/car-list-icons/Search.png";
import arrowLeft from "../../assets/arrow-left.png";
import styles from "./CarList.module.css";
import { currentCarList } from "../../Api/currentCarList.tsx";
import { useState, type ChangeEvent } from "react";

type Car = {
    number: string;
    name: string;
    mileage: number;
    status: string;     // 운행중, 미운행, 수리중
}

type carStatusBtnProp = {
    carStatusBtn: string;
    setCarStatusBtn: (value: string) => void;
}

function CarList({ carStatusBtn, setCarStatusBtn }: carStatusBtnProp) {

    const [inputVal, setInputVal] = useState<string>("");
    const [selectedCar, setSelectedCar] = useState<Car | null>(null);

    function handleCarStatusBtn(e: ChangeEvent<HTMLSelectElement>) {
        setCarStatusBtn(e.target.value);
    }

    const carStatusClass: Record<string, string> = {
        "운행중": "bg-[#c1d8ff] text-[#5491f5]",
        "미운행": "bg-[#ffcac6] text-[#e94b3e]",
        "수리중": "bg-[#ffe4be] text-[#ffa62a]"
    }

    function handleInput(event: ChangeEvent<HTMLInputElement>) {
        setInputVal(event.target.value);
    }

    function clearInput() {
        setInputVal("");
    }

    const filteredCarList = currentCarList.filter((car) => {
        const keyword = inputVal.trim().toLowerCase();

        const matchesKeyWord = car["name"].trim().toLowerCase().includes(keyword) || 
                                car["number"].trim().toLowerCase().includes(keyword);

        const matchesStatus = car["status"] === carStatusBtn || carStatusBtn === "전체";

        return matchesKeyWord && matchesStatus;
    })

    if(selectedCar) {
        return (
            <section className={`${styles["car-list"]} border w-[300px] h-[400px] flex flex-col rounded-xl bg-white box-border p-3`}>
                <button className="flex items-center cursor-pointer" onClick={() => setSelectedCar(null)}>
                    <img src={arrowLeft} alt="뒤로가기 버튼" className="w-6 h-6 mr-2"/>
                    <span className="text-lg font-bold">뒤로 가기</span>
                </button>
                <p className="mb-5 font-bold opacity-20 ml-1">
                    {selectedCar.number}
                </p>
                <table>
                    <tbody>
                        <tr>
                            <th className={styles["th"]}>운전자</th>
                            <td className={styles["td"]}>데이터없음</td>
                        </tr>
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
                </table>
            </section>
        )
    }
    
    return (
        <section className={`${styles["car-list"]} border w-[300px] h-[400px] flex flex-col rounded-xl bg-white box-border p-3`}>
            <h3 className="flex justify-between items-center font-bold text-xl mb-2 pr-1">
                <div className="flex items-center">
                    <img src={truck} alt="트럭 아이콘" className="mr-2" />
                    <span>차량 리스트</span>
                </div>
                <select onChange={handleCarStatusBtn} className="border-2 px-1 cursor-pointer">
                    <option value="전체">전체</option>
                    <option value="운행중">운행중</option>
                    <option value="미운행">미운행</option>
                    <option value="수리중">수리중</option>
                </select>
            </h3>
            <form action="#" onSubmit={e => e.preventDefault()} className="mb-2">
                <label className={`${styles["car-list__input"]} flex items-center border-none rounded px-2 py-1`}>
                    <img src={searchGlass} alt="검색 아이콘" className="w-4 h-4 mr-2" />
                    <input value={inputVal} onChange={handleInput} type="text" placeholder="차량 검색" className="w-full h-7 outline-none text-sm" />
                    {inputVal && <button onClick={clearInput} type="button" className="text-sm cursor-pointer opacity-30 mr-[3px]">X</button>}
                </label>
            </form>

            <ul className="flex-1 overflow-y-auto space-y-2 pr-2">
                {filteredCarList.map((car) => {
                    const iconSrc = carStatusClass[car.status];

                    return <li key={car.number} onClick={() => setSelectedCar(car)}
                        className={`${styles["car-list__item"]} flex items-center rounded-lg box-border px-2 py-2`}>
                        <span className={`p-1 px-2 font-bold mr-[7px] border text-sm rounded-sm ${iconSrc}`}>{car.status}</span>
                        <span className="font-bold">{car.number} {car.name}</span>
                    </li>
                })}
            </ul>
    </section>
    );
}

export default CarList;