import { MapPin, Calendar, ChevronRight, ChevronLeft } from "lucide-react";
import total from "../../assets/car-status-icons/total.svg";
import working from "../../assets/car-status-icons/working.svg";
import notWorking from "../../assets/car-status-icons/not-working.svg";
import checkingIndicator from "../../assets/car-status-icons/checking-indicator.svg";
import notWorkingIndicator from "../../assets/car-status-icons/not-working-indicator.svg";
import workingIndicator from "../../assets/car-status-icons/working-indicator.svg";
import styles from "./Home.module.css";

import CarsPerDayChart from "@/components/Charts/CarsPerDayChart";
import TopActivatedCarsChart from "@/components/Charts/TopActivatedCars";
import MapHome from "@/components/Map/MapHome";

import { useCarStatusBtnStore } from "@/Store/Home/mapState";

import { type CarStatusNum, fetchCarStatistics } from "@/Api/Home/CarStatistics";
import { useEffect, useState, useRef } from "react";
import { prcInterval } from 'precision-timeout-interval';
import { Separator } from "@/components/ui/separator";

import useEmblaCarousel from 'embla-carousel-react'

type CarStatus = "전체" | "ACTIVE" | "INACTIVE" | "INSPECTING";

function Home() {
  const [carStat, setCarStat] = useState<CarStatusNum | null>(null);
  const prevCarStat = useRef<CarStatusNum | null>(null);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  const { carStatusBtn, setCarStatusBtn } = useCarStatusBtnStore();

  useEffect(() => {
    let mounted = true;

    const getStat = () => {
      fetchCarStatistics()
        .then((carStat) => {
          if(JSON.stringify(prevCarStat.current) !== JSON.stringify(carStat)){
            prevCarStat.current = carStat;
            setCarStat(carStat);
          }
        })
        .catch((error) => console.error(error));
    };
    getStat();      // 처음에 함수를 바로 호출하여 화면에 나타내기

    const intervalId = prcInterval(15_000, () => {
      if(!mounted) return;        // 컴포넌트가 마운트 안되면 return 하기
      getStat();
    });

    return () => {
      mounted = false;
      intervalId.cancel();
    };
  }, [])
 
  if(!carStat) return;
  const { 
    vehicles: totalCarsNum, 
    active: activeCarsNum, 
    inactive: inactiveCarsNum, 
    inspect: inspectedCarsNum 
  } = carStat;

  const percentage = Math.round((activeCarsNum / totalCarsNum) * 100);

  const handlePrevClick = () => {
    if (emblaApi) {
      emblaApi.scrollPrev();
    }
  };

  const handleNextClick = () => {
    if (emblaApi) {
      emblaApi.scrollNext();
    }
  };

  return (
    <main className={`flex-col box-border p-5 w-full min-h-[calc(100vh*0.75)]`}>
      <div className="flex gap-5 mb-5">
        <div
          className="flex w-full justify-evenly items-center border p-[23px] min-h-[110px]"
        >
          <div className="flex flex-col gap-4 min-w-[280px]">
            <div className="flex items-center gap-2">
              <img className="w-10 h-10 mr-2" src={total} alt="전체 차량 아이콘" />
              <div>
                <span className="text-2xl font-bold mr-2">{totalCarsNum}</span>
                <span className="text-sm opacity-60">전체 차량</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <img className="w-10 h-10 mr-2" src={working} alt="운행 차량 아이콘" />
              <div>
                <span className="text-2xl font-bold mr-2">{percentage}%</span>
                <span className="text-sm opacity-60">운행중 차량 ({activeCarsNum})</span>
                <div className="w-50 h-2 mt-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500" style={{ width: `${percentage}%` }} />
                </div>
              </div>
            </div>
          </div>
          <Separator orientation="vertical" className="h-20 mx-6" />
          <div className="flex gap-4 min-w-[280px]">
            <div className="flex items-center gap-2 min-w-[300px]">
              <img className="w-15 h-15 mr-3" src={notWorking} alt="미운행 차량 아이콘" />
              <div>
                <span className="text-4xl font-bold mr-3">{100 - percentage}%</span>
                <span className="text-sm opacity-60">미운행 차량 ({inactiveCarsNum})</span>
                <div className="w-50 h-2 mt-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-red-500" style={{ width: `${100 - percentage}%` }} />
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center min-w-[100px]">
                <img className="w-8 h-8 mr-1" src={checkingIndicator} alt="점검중 차량 아이콘" />
                <div>
                  <span className="font-bold mr-1">점검중인 차량</span>
                  <span className="text-[14px] opacity-60">{inspectedCarsNum}대</span>
                </div>
              </div>
              <div className="flex items-center">
                <img className="w-8 h-8 mr-1" src={notWorkingIndicator} alt="미운행 차량 아이콘" />
                <div>
                  <span className="font-bold mr-1">미운행 차량</span>
                  <span className="text-[14px] opacity-60">{inactiveCarsNum}대</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex gap-4 h-[100%]">
        <div className="flex flex-col flex-2 gap-5">
          <div
            className={`border box-border pr-4 pt-4 pb-4 h-[100%]`}
          >
            <div className="flex items-center ml-4 mb-5 font-bold">
              <Calendar className="w-6 h-6 mr-2" />
              <span className="text-xl">이번주 일별 운행 건수</span>
            </div>
            <div className="w-full h-[90%] relative">
              <div className={styles.embla} ref={emblaRef}>
                <div className={styles.embla__container}>
                  <div className={`${styles.embla__slide} pr-7`}>
                    <CarsPerDayChart />
                  </div>
                  <div className={`${styles.embla__slide} pr-1`}>
                    <TopActivatedCarsChart />
                  </div>
                </div>
              </div>
              <button className={`${styles["prev-btn"]} prev-btn absolute left-0 top-[45%] opacity-50 cursor-pointer`} 
                onClick={handlePrevClick}
              >
                <ChevronLeft className="w-12 h-12"/>
              </button>
              <button className={`${styles["prev-btn"]} absolute -right-4 top-[45%] opacity-50 cursor-pointer`}
                onClick={handleNextClick}
              >
                <ChevronRight className="w-12 h-12"/>
              </button>
            </div>
          </div>
        </div>
        <div
          className={`flex-3 border box-border p-4 pt-2 h-[100%]`}
        >
          <div className="w-[100%] h-[9%] flex items-center justify-between">
            <div className="flex items-center min-w-[120px]">
              <MapPin className="w-7 h-7 mr-2" />
              <span className="font-bold text-xl">차량 현황</span>
            </div>
            <div className="flex justify-around w-[75%] min-w-[370px]">
              <label className="flex items-center font-bold mr-1 min-w-[60px]">
                <input
                  type="checkbox"
                  value="전체"
                  onChange={(e) => setCarStatusBtn(e.target.value as CarStatus)}
                  checked={carStatusBtn === "전체"}
                  className="w-4 h-4 mr-1"
                />
                <span>전체</span>
              </label>
              <label className="flex items-center font-bold mr-1 min-w-[100px]">
                <input
                  type="checkbox"
                  value="ACTIVE"
                  onChange={(e) => setCarStatusBtn(e.target.value as CarStatus)}
                  checked={carStatusBtn === "ACTIVE"}
                  className="w-4 h-4 mr-1"
                />
                <img src={workingIndicator} className="mr-1 w-6" />
                <span>운행중</span>
              </label>
              <label className="flex items-center font-bold mr-1 min-w-[100px]">
                <input
                  type="checkbox"
                  value="INACTIVE"
                  onChange={(e) => setCarStatusBtn(e.target.value as CarStatus)}
                  checked={carStatusBtn === "INACTIVE"}
                  className="w-4 h-4 mr-1"
                />
                <img src={notWorkingIndicator} className="mr-1 w-6" />
                <span>미운행</span>
              </label>
              <label className="flex items-center font-bold mr-1 min-w-[100px]">
                <input
                  type="checkbox"
                  value="INSPECTING"
                  onChange={(e) => setCarStatusBtn(e.target.value as CarStatus)}
                  checked={carStatusBtn === "INSPECTING"}
                  className="w-4 h-4 mr-1"
                />
                <img src={checkingIndicator} className="mr-1 w-6" />
                <span>점검중</span>
              </label>
            </div>
          </div>
          <div className="w-[100%] h-[91%]">
            <MapHome maxLevel={13} minLevel={10} />
          </div>
        </div>
      </div>
    </main>
  );
}

export default Home;
