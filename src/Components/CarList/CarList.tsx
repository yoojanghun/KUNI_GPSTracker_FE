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
import { useMapCarLocationStore } from "@/Store/Map/locationSearchTotalCarsLoc";
import { 
  useSelectCarStore, 
  useCarListPageStore,
  useTrackCarStore,
  useCarStatusOptionStore,
  useSelectedCarLatLng,
} from "@/Store/LocationSearch/carList";
import { useCarStore } from "@/Store/carStore";
import { fetchTotalCarsList, useSearchedCar } from "@/Api/CarList/carListStore";
import { useDLogStore } from "@/Store/dlogStore";
import { StatusBadge } from "../StatusBadge";
import { type SelectedCar, fetchSelectedCarStat } from "@/Api/CarList/SelectedCarInfo";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./CarList.module.css";

type CarList = {
  carNumber: string;
  type: string;
  status: string; 
  totalDist: number;
}

function CarList() {
  const { searchedCar, setSearchedCar} = useSearchedCar();
  const { selectedCar, setSelectedCar } = useSelectCarStore();
  const { carListPage, setCarListPage } = useCarListPageStore();
  const { setMapCenterCarList, setMapLevelCarList} = useTrackCarStore();
  const { carStatusOption, setCarStatusOption } = useCarStatusOptionStore();

  const [logs, setLogs] = useState<CarList[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1)
  const setSelectedCarLatLng = useSelectedCarLatLng(
    (state) => state.setLatLng
  );
  const setSelectedCarNumber = useSelectedCarLatLng(
    (state) => state.setCarNumber
  );

  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [selectedCarInfo, setSelectedCarInfo] = useState<SelectedCar | null>(null);

  const navigate = useNavigate();
  const setCarNumLog = useDLogStore((state) => state.setVehicleNumber);
  const setCarNumManage = useCarStore((state) => state.setVehicleNumber);
  
  const tableRef = useRef<HTMLDivElement>(null); // 테이블의 너비값을 전달하기 위한 wrapper
  const [currentPage, setCurrentPage] = useState(1);

  const carLocations = useMapCarLocationStore((state) => state.carLocations);

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
  }, [totalCarLoc]);

  // 리스트에서 클릭된 차량에 대한 정보를 받음. (/api/location/{vehicleNumber})
  // 리스트에서 선택된 차량 객체(selectedCar)의 차량번호(selectedCar.vehicleNumber)과 
  // gpsRecordId값(초기엔 0)을 파라미터로 보냄
  // 그리고 받은 정보들(차량 gps값, status, vehicleNumber, 다음 gpsRecordId값)을 
  // selectedCarInfo에 저장
  useEffect(() => {
    if (!selectedCar) {
      setSelectedCarInfo(null);
      return;
    }
    fetchSelectedCarStat(selectedCar.vehicleNumber, 0)
      .then(car => setSelectedCarInfo(car))
      .catch(console.error);
  }, [selectedCar]);

  // 초기값 gpsRecordId가 0이 아닐 때(초기값을 받은 이후에) gpsRecordId가 바뀔 때마다(현재 3초 간격)
  // api 요청해서 에뮬레이터의 다음 gps 값을 받음
  // setSelectedCarNumber => 리스트에서 클릭된 차량 정보를 저장
  // setSelectedCarLatLng => 그 차량의 gps 저장, gps 값이 바뀔 때마다 mapLocationSearch에서 마커를 다시 그림
  useEffect(() => {
    if (!selectedCar || selectedCarInfo?.gpsRecordId == null) return;

    const intervalId = setInterval(() => {
      fetchSelectedCarStat(selectedCar.vehicleNumber, selectedCarInfo.gpsRecordId)
        .then(car => {
          setSelectedCarInfo(car); 
          setSelectedCarLatLng(car.location);
          setSelectedCarNumber(car.vehicleNumber);
        })
        .catch(console.error);
    }, 3000);

    return () => clearInterval(intervalId);
  }, [selectedCar, selectedCarInfo?.gpsRecordId]);

  // 만들어 주신 StatusBadge, tablePagination 컴포넌트를 적극 활용하였습니다
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
                      // carLocations에서 carNumber 찾기
                      // carLocations 배열은 지도의 차량 gps가 담긴 배열 (/api/dashboard/map의 반환값)
                      const carLocObj = carLocations.find((carObj) => carObj.vehicleNumber === car.carNumber )
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
