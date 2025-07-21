import { useNavigate, useParams } from "react-router-dom";
import { useRef, useEffect } from "react";
import { Button } from "@/Components/ui/button";
import { Clipboard, Clock, ClockFading, Map } from "lucide-react";
import { useDLogStore } from "@/Store/dlogStore";
import { DLogHeader } from "./DLogHeader";
import { makeOverlayHTML } from "@/Components/DLogComponents/MapOverlay";
import { detailLog } from "@/Api/detailLog";
import indicator from "../../Components/Indicators.svg";

export function DLogDetails() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<kakao.maps.Map | null>(null);

  console.log("detailLog record 확인:", detailLog?.record);

  // 임시 위도 경도
  let startLat = detailLog.startLat;
  let startLong = detailLog.startLong;
  let endLat = detailLog.endLat;
  let endLong = detailLog.endLong;
  let centerLat = (startLat + endLat) / 2;
  let centerLong = (startLong + endLong) / 2;

  const startPosition = new kakao.maps.LatLng(startLat, startLong);
  const endPosition = new kakao.maps.LatLng(endLat, endLong);

  // 마커 설정
  const markerImage = new kakao.maps.MarkerImage(
    indicator,
    new kakao.maps.Size(28, 28),
    { offset: new kakao.maps.Point(14, 14) }
  );
  const startMarker = new kakao.maps.Marker({
    position: new kakao.maps.LatLng(startLat, startLong),
    image: markerImage,
  });
  const endMarker = new kakao.maps.Marker({
    position: new kakao.maps.LatLng(endLat, endLong),
    image: markerImage,
  });

  const startOverlay = new kakao.maps.CustomOverlay({
    position: startPosition,
    content: makeOverlayHTML("start", startLat, startLong),
    yAnchor: 1.2,
    xAnchor: 1.2,
  });
  const endOverlay = new kakao.maps.CustomOverlay({
    position: endPosition,
    content: makeOverlayHTML("end", endLat, endLong),
    yAnchor: -0.2,
    xAnchor: -0.2,
  });

  useEffect(() => {
    if (!containerRef.current || !detailLog || !detailLog.record.length) return;

    const options = {
      center: new kakao.maps.LatLng(centerLat, centerLong),
      level: 4,
    };
    const map = new kakao.maps.Map(containerRef.current, options);
    mapRef.current = map;

    // 이동경로 설정
    const path = detailLog.record.map(
      (k) => new kakao.maps.LatLng(k.lat, k.long)
    );
    const polyline = new kakao.maps.Polyline({
      path: path,
      strokeWeight: 4,
      strokeColor: "#000000",
      strokeOpacity: 0.8,
      strokeStyle: "solid",
    });
    startMarker.setMap(map);
    endMarker.setMap(map);
    polyline.setMap(map);

    kakao.maps.event.addListener(startMarker, "mouseover", () => {
      startOverlay.setMap(mapRef.current);
    });
    kakao.maps.event.addListener(startMarker, "mouseout", () => {
      startOverlay.setMap(null);
    });
    kakao.maps.event.addListener(endMarker, "mouseover", () => {
      endOverlay.setMap(mapRef.current);
    });
    kakao.maps.event.addListener(endMarker, "mouseout", () => {
      endOverlay.setMap(null);
    });
  }, [detailLog]);

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
          <div
            ref={containerRef}
            id="map"
            className="w-full h-[400px] rounded-[6px]"
          ></div>
        </div>
      </div>
      <div className="mt-6"></div>
    </div>
  );
}
