import truck from "../../assets/car-list-icons/truck.png";
import searchGlass from "../../assets/car-list-icons/Search.png";
import styles from "./CarList.module.css";
import { currentCarList } from "../currentCarList.tsx";
import { useState, type ChangeEvent } from "react";

function CarList() {

    const [inputVal, setInputVal] = useState("");

    const carStatusImg: Record<string, string> = {
        "운행중": "bg-[#c1d8ff] text-[#5491f5]",
        "미운행": "bg-[#ffcac6] text-[#e94b3e]",
        "수리중": "bg-[#ffe4be] text-[#ffa62a]"
    }

    function handleInput(event: ChangeEvent<HTMLInputElement>) {
        setInputVal(event.target.value);
    }

    const filteredCarList = currentCarList.filter((car) => {
        return car["number"].toLowerCase().includes(inputVal.toLowerCase());
    })
    
    return (
        <section className={`${styles["car-list"]} border w-[300px] h-[400px] flex flex-col rounded-xl bg-white`}>
            <h3 className="flex items-center p-2 font-bold text-xl">
                <img src={truck} alt="트럭 아이콘" className="mr-2" />
                <span>차량 리스트</span>
            </h3>
            <form action="#" className="p-2 mb-2">
                <label className={`${styles["car-list__input"]} flex items-center border-none rounded px-2 py-1`}>
                    <img src={searchGlass} alt="검색 아이콘" className="w-4 h-4 mr-2" />
                    <input onChange={handleInput} type="text" placeholder="차량 검색" className="w-full outline-none text-sm" />
                </label>
            </form>

            <ul className="flex-1 overflow-y-auto p-2 space-y-2">
                {filteredCarList.map((car) => {
                    const iconSrc = carStatusImg[car.status];

                    return <li key={car.number} 
                        className={`${styles["car-list__item"]} flex items-center rounded-lg box-border px-2 py-2`}>
                        <span className={`p-1 px-2 font-bold mr-[7px] border text-sm rounded-sm ${iconSrc}`}>{car.status}</span>
                        <span className="font-bold">{car.number}</span>
                    </li>
                })}
            </ul>
    </section>
    );
}

export default CarList;