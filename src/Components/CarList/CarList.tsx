import truck from "../../assets/car-list-icons/truck.png";
import searchGlass from "../../assets/car-list-icons/Search.png";
import ellipse1 from "../../assets/car-list-icons/ellipse1.png";
import ellipse2 from "../../assets/car-list-icons/ellipse2.png";
import ellipse3 from "../../assets/car-list-icons/ellipse3.png";
import styles from "./CarList.module.css";


function CarList() {
    return (
        <section className={`${styles["car-list"]} border min-w-[200px] h-[347px] flex flex-col rounded-xl bg-white`}>
            <h3 className="flex items-center p-2 font-bold text-xl">
                <img src={truck} alt="트럭 아이콘" className="mr-2" />
                <span>차량 리스트</span>
            </h3>
            <form action="#" className="p-2">
                <label className={`${styles["car-list__input"]} flex items-center border-none rounded px-2 py-1`}>
                    <img src={searchGlass} alt="검색 아이콘" className="w-4 h-4 mr-2" />
                    <input type="text" placeholder="차량 검색" className="w-full outline-none text-sm " />
                </label>
            </form>

            <ul className="flex-1 overflow-y-auto p-2 space-y-2">
                <li className={`${styles["car-list__item"]} flex items-center border rounded-lg box-border px-2 py-1`}>
                    <img src={ellipse1} className="w-4 h-4 mr-2" />
                    <span className="font-bold">12가3456</span>
                </li>
                <li className={`${styles["car-list__item"]} flex items-center border rounded-lg box-border px-2 py-1`}>
                    <img src={ellipse2} className="w-4 h-4 mr-2" />
                    <span className="font-bold">99나9999</span>
                </li>
                <li className={`${styles["car-list__item"]} flex items-center border rounded-lg box-border px-2 py-1`}>
                    <img src={ellipse3} className="w-4 h-4 mr-2" />
                    <span className="font-bold">356호3456</span>
                </li>
            </ul>
    </section>
    );
}

export default CarList;