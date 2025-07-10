import total from "../../assets/car-status-icons/total.png";
import working from "../../assets/car-status-icons/working.png";
import notWorking from "../../assets/car-status-icons/not-working.png";
import checkingIndicator from "../../assets/car-status-icons/checking-indicator.png";
import notWorkingIndicator from "../../assets/car-status-icons/not-working-indicator.png";
import styles from "./Home.module.css";

import SimpleLineChart from "@/Components/chart";
import MapTest from "@/Components/map";


function Home() {
    const percentage = 30;

    return (
        <main className="flex-1 box-border p-5">
            <div className="flex gap-3 mb-5">
                <div className={`${styles["icon"]} flex flex-1 justify-center items-center border rounded-xl p-[23px] min-w-[202px] max-h-[90px]`}>
                    <img className="w-10 h-10 mr-2" src={total} alt="전체 차량 아이콘" />
                    <div>
                        <div>
                            <span className="text-xl font-bold mr-2">2000</span>
                            <span className="text-xs opacity-60">전체 차량</span>
                        </div>
                        {/* <div>progress bar 여긴 없음</div> */}
                    </div>
                </div>

                <div className={`${styles["icon"]} flex flex-2 justify-center items-center border rounded-xl p-[23px] max-h-[90px]`}>
                    <div className="flex items-center min-w-[230px]">
                        <img className="w-10 h-10 mr-2" src={notWorking} alt="미운행 차량 아이콘"/>
                        <div>
                            <div>
                                <span className="text-xl font-bold mr-2">{percentage}%</span>
                                <span className="text-xs opacity-60">미운행 차량 (1,001)</span>
                            </div>
                            <div className="w-40 h-2 mt-2 bg-gray-200 rounded-full overflow-hidden">
                                <div className="h-full bg-red-500" style={{ width: `${percentage}%` }} />
                            </div>
                        </div>
                    </div>
                    <div className="min-w-[160px]">
                        <div className="flex items-center mb-2">
                            <img className="w-6 h-6 mr-1" src={checkingIndicator} alt="점검중 차량 아이콘" />
                            <div>
                                <span className="text-xs font-bold mr-1">점검중인 차량</span>
                                <span className="text-[10px] opacity-60">301대</span>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <img className="w-6 h-6 mr-1" src={notWorkingIndicator} alt="미운행 차량 아이콘" />
                            <div>
                                <span className="text-xs font-bold mr-1">미운행 차량</span>
                                <span className="text-[10px] opacity-60">700대</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="text-xl font-bold mb-1">100%</span>
                        <span className="text-xs opacity-60">가동률</span>
                    </div>
                </div>
            </div>
            <div className="flex gap-4 h-[80%]">
                <div className="flex flex-col flex-2 gap-5">
                    <div className={`${styles["icon"]} flex justify-center items-center border rounded-xl p-[23px] max-h-[90px]`}>
                        <img className="w-10 h-10 mr-2" src={working} alt="운행 차량 아이콘" />
                        <div>
                            <div>
                                <span className="text-xl font-bold mr-2">{100 - percentage}%</span>
                                <span className="text-xs opacity-60">운행 중 차량 (999)</span>
                            </div>
                            <div className="w-40 h-2 mt-2 bg-gray-200 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500" style={{ width: `${100 - percentage}%` }} />
                            </div>
                        </div>
                    </div>
                    <SimpleLineChart />
                </div>
                <MapTest flexSize={3} />
            </div>
        </main>
    );
}

export default Home;