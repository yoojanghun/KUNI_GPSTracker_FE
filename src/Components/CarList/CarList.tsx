import {
  Search,
  Truck,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  X,
  Folder,
  Wrench
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/Components/ui/table";
import { TablePagination } from "../TablePagination";
import { StatusBadge } from "../StatusBadge";
import { useAllCarLocationStore } from "@/Store/Map/locationSearchTotalCarsLoc"
import { 
  useSelectCarStore, 
  useCarListPageStore,
  useTrackCarStore,
  useCarStatusOptionStore,
} from "@/Store/LocationSearch/carList";
import { useCarStore } from "@/Store/carStore";
import { useDLogStore } from "@/Store/dlogStore";
import { fetchTotalCarsList, useSearchedCar } from "@/Api/CarList/carListStore";
import { type SelectedCar, fetchSelectedCarStat } from "@/Api/CarList/SelectedCarInfo";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./CarList.module.css";
import { prcInterval } from "precision-timeout-interval";

type CarList = {
  carNumber: string;
  type: string;
  status: string; 
  totalDist: number;
}

function CarList() {
  const searchedCar = useSearchedCar(state => state.searchedCar);
  const setSearchedCar = useSearchedCar(state => state.setSearchedCar);
  const selectedCar = useSelectCarStore(state => state.selectedCar);
  const setSelectedCar = useSelectCarStore(state => state.setSelectedCar);
  const carListPage = useCarListPageStore(state => state.carListPage);
  const setCarListPage = useCarListPageStore(state => state.setCarListPage);
  const setMapCenterCarList = useTrackCarStore(state => state.setMapCenterCarList);
  const setMapLevelCarList = useTrackCarStore(state => state.setMapLevelCarList);
  const carStatusOption = useCarStatusOptionStore(state => state.carStatusOption);
  const setCarStatusOption = useCarStatusOptionStore(state => state.setCarStatusOption);

  const [logs, setLogs] = useState<CarList[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1)

  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [selectedCarInfo, setSelectedCarInfo] = useState<SelectedCar | null>(null);

  const navigate = useNavigate();
  const setCarNumLog = useDLogStore((state) => state.setVehicleNumber);
  const setCarNumManage = useCarStore((state) => state.setVehicleName);
  
  const tableRef = useRef<HTMLDivElement>(null); // 테이블의 너비값을 전달하기 위한 wrapper
  const [currentPage, setCurrentPage] = useState(1);

  const allCarLocations = useAllCarLocationStore((state) => state.allCarLocations);

  const hideBtnRef = useRef<HTMLButtonElement | null>(null);

  // 페이지네이션을 차량 리스트(carList.tsx)에 적용하기 위해 (/api/vehicle) 받음.
  // 파라미터는 순서대로 "현재 페이지", "페이지당 차량리스트 수", "검색창에 입력된 차량이름", "차량 status"
  // 전체 차량 리스트들을 logs에 저장, 전체 페이지 수를 totalPages에 저장
  const totalCarLoc = useCallback(async () => {
    try {
      const result = await fetchTotalCarsList(
        currentPage - 1,
        9,
        !searchedCar ? null : searchedCar,
        carStatusOption,
      )
      setLogs(result.content);
      setTotalPages(result.totalPages);
    } catch(err) {
      console.error("Error Fetching logs: ", err)
    }
  }, [currentPage, searchedCar, carStatusOption])

  useEffect(() => {
    totalCarLoc();
    console.log("페이지네이션");
  }, [totalCarLoc]);

  // 아래는 하나의 차량을 선택했을 때, 해당 차량 gps, 정보 가져오는 api(수정 필요)
  useEffect(() => {
    if (!selectedCar) {
      setSelectedCarInfo(null);
      return;
    }
    fetchSelectedCarStat(selectedCar.vehicleNumber)
      .then(car => {
        setSelectedCarInfo(car);
        console.log("첫 번째 gps (한 차량)");})
      .catch(console.error);
  }, [selectedCar?.vehicleNumber]);

  useEffect(() => {
    if (!selectedCar) return;

    const intervalCtrl = prcInterval(3000, () => {
      fetchSelectedCarStat(selectedCar.vehicleNumber)
        .then(car => {
          setSelectedCarInfo(car); 
          console.log("gps는 이거에요 (한 차량): ", car.location);
        })
        .catch(console.error);
    });

    return () => intervalCtrl.cancel();
  }, [selectedCar]);

  // 만약 selectedCar가 존재(차량 리스트에서 차량 선택) 그리고, carListPage라는 변수가 true라면 정보페이지를 보여줌
  if (selectedCar && carListPage) {
    return (
      <section
        className={`${styles["car-list"]} border w-75 max-h-130 flex flex-col rounded-xl bg-white box-border p-3`}
      >
        <div className="flex justify-between items-center font-bold text-xl pr-1">
          <button
            className="flex items-center cursor-pointer"
            onClick={() => setCarListPage(false)}
          >
            <ArrowLeft className="w-6 h-6 mr-2" />
            <span className="text-lg font-bold">뒤로 가기</span>
          </button>
          <Select value={carStatusOption} onValueChange={setCarStatusOption}>
            <SelectTrigger className="border-2 px-1 cursor-pointer rounded-sm min-w-[85px]">
              <SelectValue placeholder="전체" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="전체" className="cursor-pointer">
                전체
              </SelectItem>
              <SelectItem value="ACTIVE" className="cursor-pointer">
                <StatusBadge status={"ACTIVE"} />
              </SelectItem>
              <SelectItem value="INACTIVE" className="cursor-pointer">
                <StatusBadge status={"INACTIVE"} />
              </SelectItem>
              <SelectItem value="INSPECTING" className="cursor-pointer">
                <StatusBadge status={"INSPECTING"} />
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <p className="font-bold opacity-20 ml-1">{selectedCar.vehicleNumber}</p>
        {isVisible && (
          <>
            <table className="my-5">
              <tbody>
                <tr>
                  <th className={`${styles["th"]} w-30`}>차량번호</th>
                  <td className={styles["td"]}>{selectedCar.vehicleNumber}</td>
                </tr>
                <tr>
                  <th className={`${styles["th"]} w-30`}>차량명</th>
                  <td className={styles["td"]}>{selectedCar.type}</td>
                </tr>
                <tr>
                  <th className={`${styles["th"]} w-30`}>상태</th>
                  <td className={styles["td"]}>
                    <span className={`p-1 px-2 font-bold text-sm rounded-sm`}>
                      <StatusBadge status={selectedCar.status} />
                    </span>
                  </td>
                </tr>
                <tr>
                  <th className={`${styles["th"]} w-30`}>운행일자</th>
                  <td className={styles["td"]}>{selectedCarInfo?.drivingDate}</td>
                </tr>
                <tr>
                  <th className={`${styles["th"]} w-30`}>운행시간</th>
                  <td className={styles["td"]}>{selectedCarInfo?.drivingTime} 분</td>
                </tr>
                <tr>
                  <th className={`${styles["th"]} w-30`}>운행거리</th>
                  <td className={styles["td"]}>{selectedCarInfo?.drivingDistanceKm} m</td>
                </tr>
              </tbody>
            </table>
            <button
              onClick={() => {
                setCarNumManage(selectedCar.vehicleNumber);
                navigate("/management");
              }}
              className="border cursor-pointer font-bold py-1 rounded-sm flex justify-center items-center mb-2"
            >
              <Wrench className="mr-1.5"/>
              차량관리 이동
            </button>
            <button
              onClick={() => {
                setCarNumLog(selectedCar.vehicleNumber);
                navigate("/log");
              }}
              className="border cursor-pointer font-bold py-1 rounded-sm flex justify-center items-center"
            >
              <Folder className="mr-1.5" />
              운행일지 이동
            </button>
          </>
        )}
        {/* carList.tsx창 최소화(isVisible이 false), 최대화(isVisible이 true) 버튼 */}
        <button
          ref={hideBtnRef}
          onClick={() => {
            setIsVisible(!isVisible);
          }}
          className={`${styles["hide-btn"]} rounded-br-xl rounded-bl-xl h-6 border flex justify-center`}
        >
          {isVisible ? <ChevronUp /> : <ChevronDown />}
        </button>
      </section>
    );
  }

  return (
    <section
      ref={tableRef}
      className={`${styles["car-list"]} border w-80 max-h-145 flex flex-col rounded-xl bg-white box-border p-3`}
    >
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
            <SelectItem value="전체" className="cursor-pointer">
              전체
            </SelectItem>
            <SelectItem value="ACTIVE" className="cursor-pointer">
              <StatusBadge status={"ACTIVE"} />
            </SelectItem>
            <SelectItem value="INACTIVE" className="cursor-pointer">
              <StatusBadge status={"INACTIVE"} />
            </SelectItem>
            <SelectItem value="INSPECTING" className="cursor-pointer">
              <StatusBadge status={"INSPECTING"} />
            </SelectItem>
          </SelectContent>
        </Select>
      </h3>

      {/* car는 각 차량 객체 */}
      {isVisible && (
        <>
          <form action="#" onSubmit={(e) => e.preventDefault()} className="mb-3">
          <label
            className={`${styles["car-list__input"]} flex items-center border-none rounded px-2 py-1`}
          >
            {/* 검색창에서 검색한 내용이 searchedCar로 들어감. 그걸로 다시 api 요청. */}
            <Search className="w-4 h-4 mr-2" />
            <input
              value={!searchedCar ? "" : searchedCar}
              onChange={(e) => {setSearchedCar(e.target.value); setCurrentPage(1);}}
              type="text"
              placeholder="차량 번호 검색"
              className="w-full h-7 outline-none text-xl"
            />
            {/* 뭔가 검색을 했는데 X 버튼 누르면 검색한 거 사라짐 */}
            {searchedCar && (
              <button
                onClick={() => setSearchedCar("")}
                type="button"
                className="text-sm cursor-pointer opacity-30 mr-[3px] hover:bg-gray-400 rounded-full"
              >
                <X />
              </button>
            )}
          </label>
          </form>
          <div ref={tableRef} className="h-100 flex flex-col justify-between gap-4 p-1">
            <Table>
              <TableBody>
                {logs.map((car) => (
                  <TableRow 
                    key={car.carNumber} 
                    className="cursor-pointer flex justify-between"
                    onClick={() => {
                      // allCarLocations에서 carNumber 찾기
                      // allCarLocations 배열은 지도의 모든 차량 gps(500대)가 담긴 배열 (/api/dashboard/map의 반환값)
                      const carLocObj = allCarLocations.find((carObj) => carObj.vehicleNumber === car.carNumber )
                      if(!carLocObj) {
                        window.alert("차량이 리스트엔 있는데, 지도엔 없어요")
                        return
                      };

                      // zustand에 클릭된 차량의 gps값을 저장하여 그 차량의 위치를 중심으로 지도 이동
                      setMapCenterCarList({
                        lat: carLocObj.latitude,
                        lng: carLocObj.longitude,
                      });
                      // 지도를 "2" 크기만큼 확대
                      setMapLevelCarList(2);
                      setSelectedCar(carLocObj);
                      setCarListPage(true);
                    }}
                  >
                    <TableCell className="font-medium">{car.carNumber}</TableCell>
                    <TableCell>{car.type}</TableCell>
                    <TableCell>
                      <StatusBadge status={car.status}/>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <TablePagination
              tableRef={tableRef}
              total={totalPages}
              current={currentPage}
              setCurrent={setCurrentPage}
            />
          </div>
        </>
      )}
      <button
        ref={hideBtnRef}
        onClick={() => {setIsVisible(!isVisible);}}
        className={`${styles["hide-btn"]} rounded-br-xl rounded-bl-xl h-6 border flex justify-center`}
      >
        {isVisible ? <ChevronUp /> : <ChevronDown />}
      </button>
    </section>
  );
}

export default CarList;
