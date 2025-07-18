import { useNavigate, useParams } from "react-router-dom";
import { useRef, useEffect } from "react";
import { Button } from "@/Components/ui/button";
import { Clipboard, Clock, ClockFading, Map } from "lucide-react";
import { useDLogStore } from "@/Store/dlogStore";
import { DLogHeader } from "./DLogHeader";
import indicator from "../../Components/Indicators.svg"


export function DLogDetails() {
  // 임시 위도 경도
  let startLat = 37.561535;
  let startLong = 126.9719692;
  let endLat = 37.566535;
  let endLong = 126.9779692;
  let centerLat = (startLat + endLat) / 2;
  let centerLong = (startLong + endLong) / 2;

  // 마커 설정
  const markerImage = new kakao.maps.MarkerImage(
    indicator,
    new kakao.maps.Size(28, 28),
  )
  const startMarker = new kakao.maps.Marker({
    position: new kakao.maps.LatLng(startLat, startLong),
    image: markerImage
  });
  const endMarker = new kakao.maps.Marker({
    position: new kakao.maps.LatLng(endLat, endLong),
    image: markerImage
  });
  

  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (containerRef.current) {
      const options = {
        center: new kakao.maps.LatLng(centerLat, centerLong),
        level: 4,
      };
      const map = new kakao.maps.Map(containerRef.current, options);
      startMarker.setMap(map);
      endMarker.setMap(map);
    }
  }, []);

  

  

  const navigate = useNavigate();
  const { recordId } = useParams();

  if (recordId === undefined) {
    throw new Error("id값이 없습니다.");
  }

  const findById = useDLogStore((state) => state.findById);
  const { startTime, endTime, distance, carNumber, carName } =
    findById(recordId);

  return (
    <div className="flex flex-col gap-6 px-8 py-8 w-full max-w-7xl mx-auto">
      <div className="w-full flex justify-between items-center">
        <div className="flex items-center gap-3">
          <DLogHeader />
          <span className="whitespace-nowrap text-xl font-medium text-[#969696]">
            {carNumber}, {carName}
          </span>
        </div>

        <Button
          variant={"outline"}
          onClick={() => navigate("/log")}
          className=""
        >
          돌아가기
        </Button>
      </div>
      <div className="m-5 mx-33">
        <div className="flex flex-row gap-14 mb-6 justify-center">
          <div className="border rounded-[12px] border-[#000000]/10 shadow-md px-8 pr-24 py-6 gap-4 flex flex-col max-h-30">
            <div className="flex items-center gap-3 font-bold text-xl">
              <Clock size={22} />
              시작 시간
            </div>
            <div className="text-[#969696] text-lg">
              {startTime.replace("T", " ")}
            </div>
          </div>
          <div className="border rounded-[12px] border-[#000000]/10 shadow-md px-8 pr-24 py-6 justify-start gap-4 flex flex-col max-h-30">
            <div className="flex items-center gap-3 font-bold text-xl">
              <ClockFading size={22} />
              종료 시간
            </div>
            <div className="text-[#969696] text-lg">
              {endTime.replace("T", " ")}
            </div>
          </div>
          <div className="border rounded-[12px] border-[#000000]/10 shadow-md px-8 pr-16 py-6 justify-start gap-4 flex flex-col max-h-30">
            <div className="flex items-center gap-3 font-bold text-xl">
              <Clipboard size={22} />총 운행거리
            </div>
            <div className="text-[#969696] text-lg">{distance} km</div>
          </div>
        </div>
        <div className="border rounded-[12px] border-[#000000]/10 shadow-md px-12 py-6 justify-start gap-4 flex flex-col">
          <div className="flex items-center gap-3 font-bold text-xl">
            <Map size={22} />
            운행 경로
          </div>
          <div ref={containerRef} id="map" className="w-full h-[400px] rounded-[6px]"></div>
        </div>
      </div>
      <div className="mt-6"></div>
    </div>
  );
}
