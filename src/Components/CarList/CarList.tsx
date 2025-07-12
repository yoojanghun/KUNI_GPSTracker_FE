import truck from "../../assets/car-list-icons/truck.png";
import searchGlass from "../../assets/car-list-icons/Search.png";
import styles from "./CarList.module.css";
import { currentCarList } from "../../Api/currentCarList.tsx";
import { useState, type ChangeEvent } from "react";

type Car = {
    number: string;
    name: string;
    mileage: string;
    status: string;     // 운행중, 미운행, 수리중
}

function CarList() {

    const [inputVal, setInputVal] = useState<string>("");
    const [selectedCar, setSelectedCar] = useState<Car | null>(null);

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

    const filteredCarList = inputVal === "" ? currentCarList : currentCarList.filter((car) => {
        if(inputVal.trim() === "") {
            return false
        }

        const keyword = inputVal.toLowerCase();
        return car["name"].toLowerCase().includes(keyword) || car["number"].toLowerCase().includes(keyword);
    })

    if(selectedCar) {
        return (
            <section className={`${styles["car-list"]} border w-[300px] h-[400px] flex flex-col rounded-xl bg-white box-border p-3`}>
                <h1>안녕</h1>
                <button className="cursor-pointer" onClick={() => setSelectedCar(null)}>뒤로 가기</button>
                <table>
                    <tr>
                        <th className={styles["th"]}>운전자</th>
                        <td className={styles["td"]}>홍길동</td>
                    </tr>
                    <tr>
                        <th className={styles["th"]}>12가 1234</th>
                        <td className={styles["td"]}>차량번호</td>
                    </tr>
                    <tr>
                        <th className={styles["th"]}>차량명</th>
                        <td className={styles["td"]}>Avante</td>
                    </tr>
                    <tr>
                        <th className={styles["th"]}>운행일자</th>
                        <td className={styles["td"]}>2025-07-07</td>
                    </tr>
                    <tr>
                        <th className={styles["th"]}>운행시간</th>
                        <td className={styles["td"]}>1시간 2분</td>
                    </tr>
                    <tr>
                        <th className={styles["th"]}>운행 거리</th>
                        <td className={styles["td"]}>50,123km</td>
                    </tr>
                </table>
            </section>
        )
    }
    
    return (
        <section className={`${styles["car-list"]} border w-[300px] h-[400px] flex flex-col rounded-xl bg-white box-border p-3`}>
            <h3 className="flex items-center font-bold text-xl mb-2">
                <img src={truck} alt="트럭 아이콘" className="mr-2" />
                <span>차량 리스트</span>
            </h3>
            <form action="#" onSubmit={e => e.preventDefault()} className="mb-2">
                <label className={`${styles["car-list__input"]} flex items-center border-none rounded px-2 py-1`}>
                    <img src={searchGlass} alt="검색 아이콘" className="w-4 h-4 mr-2" />
                    <input value={inputVal} onChange={handleInput} type="text" placeholder="차량 검색" className="w-full outline-none text-sm" />
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