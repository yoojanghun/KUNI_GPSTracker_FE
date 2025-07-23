import total from "../../assets/car-status-icons/total.svg";
import working from "../../assets/car-status-icons/working.svg";
import notWorking from "../../assets/car-status-icons/not-working.svg";
import checkingIndicator from "../../assets/car-status-icons/checking-indicator.svg";
import notWorkingIndicator from "../../assets/car-status-icons/not-working-indicator.svg";
import workingIndicator from "../../assets/car-status-icons/working-indicator.svg";

import styles from "./Home.module.css";

import SimpleLineChart from "@/Components/chart";
import MapTest from "@/Components/map";
import { useState, type ChangeEvent } from "react";
import { MapPin } from "lucide-react";


function Home() {
    const percentage = 30;
    const [carStatusBtn, setCarStatusBtn] = useState<string>("전체");

    function handleCarStatusBtn(e: ChangeEvent<HTMLInputElement>) {
        setCarStatusBtn(e.target.value);
    }

    return (
        <main className="flex-1 box-border p-5">
            <div className="flex gap-5 mb-5">
                <div className={`${styles["icon"]} flex flex-1 justify-center items-center border rounded-xl p-[23px] min-w-[202px] min-h-[110px]`}>
                    <img className="w-13 h-13 mr-3" src={total} alt="전체 차량 아이콘" />
                    <div>
                        <div>
                            <span className="text-3xl font-bold mr-2">2000</span>
                            <span className="text-sm opacity-60">전체 차량</span>
                        </div>
                        {/* <div>progress bar 여긴 없음</div> */}
                    </div>
                </div>

                <div className={`${styles["icon"]} flex flex-2 justify-center items-center border rounded-xl p-[23px] min-h-[110px]`}>
                    <div className="flex items-center min-w-[280px]">
                        <img className="w-13 h-13 mr-3" src={notWorking} alt="미운행 차량 아이콘"/>
                        <div>
                            <div className="mr-6">
                                <span className="text-3xl font-bold mr-3">{percentage}%</span>
                                <span className="text-sm opacity-60">미운행 차량 (1,001)</span>
                            </div>
                            <div className="w-50 h-2 mt-2 bg-gray-200 rounded-full overflow-hidden">
                                <div className="h-full bg-red-500" style={{ width: `${percentage}%` }} />
                            </div>
                        </div>
                    </div>
                    <div className="min-w-[180px]">
                        <div className="flex items-center mb-2">
                            <img className="w-8 h-8 mr-1" src={checkingIndicator} alt="점검중 차량 아이콘" />
                            <div>
                                <span className="font-bold mr-1">점검중인 차량</span>
                                <span className="text-[14px] opacity-60">301대</span>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <img className="w-8 h-8 mr-1" src={notWorkingIndicator} alt="미운행 차량 아이콘" />
                            <div>
                                <span className="font-bold mr-1">미운행 차량</span>
                                <span className="text-[14px] opacity-60">700대</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="text-3xl font-bold mb-1">100%</span>
                        <span className="opacity-60">가동률</span>
                    </div>
                </div>
            </div>
            <div className="flex gap-4 h-[80%]">
                <div className="flex flex-col flex-2 gap-5">
                    <div className={`${styles["icon"]} flex justify-center items-center border rounded-xl p-[23px] min-h-[110px]`}>
                        <img className="w-13 h-13 mr-3" src={working} alt="운행 차량 아이콘" />
                        <div>
                            <div>
                                <span className="text-3xl font-bold mr-2">{100 - percentage}%</span>
                                <span className="text-sm opacity-60">운행 중 차량 (999)</span>
                            </div>
                            <div className="w-50 h-2 mt-2 bg-gray-200 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500" style={{ width: `${100 - percentage}%` }} />
                            </div>
                        </div>
                    </div>
                    <div className={`${styles["icon"]} border box-border pr-4 pt-4 pb-4 h-[100%] rounded-xl`}>
                        <SimpleLineChart />
                    </div>
                </div>
                <div className={`${styles["icon"]} flex-3 border box-border p-4 pt-2 h-[100%] rounded-3xl`}>
                    <div className="w-[100%] h-[9%] flex items-center justify-between">
                        <div className="flex items-center w-[25%]">
                            <MapPin className="w-7 h-7 mr-2"/>
                            <span className="font-bold text-xl">차량 현황</span>
                        </div>
                        <div className="flex justify-around w-[75%]">
                            <label className="flex items-center font-bold mr-1">
                                <input type="checkbox" value="전체"
                                       onChange={handleCarStatusBtn}
                                       checked={carStatusBtn === "전체"} 
                                       className="w-4 h-4 mr-1"/>
                                전체
                            </label>
                            <label className="flex items-center font-bold mr-1">
                                <input type="checkbox" value="수리중"
                                       onChange={handleCarStatusBtn}
                                       checked={carStatusBtn === "수리중"}
                                       className="w-4 h-4 mr-1"/>
                                <img src={checkingIndicator} className="mr-1 w-6" />
                                점검중
                            </label>
                            <label className="flex items-center font-bold mr-1">
                                <input type="checkbox" value="미운행" 
                                       onChange={handleCarStatusBtn}
                                       checked={carStatusBtn === "미운행"}
                                       className="w-4 h-4 mr-1"/>
                                <img src={notWorkingIndicator} className="mr-1 w-6" />
                                미운행
                            </label>
                            <label className="flex items-center font-bold mr-1">
                                <input type="checkbox" value="운행중" 
                                       onChange={handleCarStatusBtn}
                                       checked={carStatusBtn === "운행중"}
                                       className="w-4 h-4 mr-1"/>
                                <img src={workingIndicator} className="mr-1 w-6" />
                                운행중
                            </label>
                        </div>
                    </div>
                    <div className="w-[100%] h-[91%]">
                        <MapTest carStatus={carStatusBtn} />
                    </div>
                </div>
            </div>
        </main>
    );
}

export default Home;