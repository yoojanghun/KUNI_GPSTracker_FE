import { useNavigate, useParams } from "react-router-dom";
import { useRef, useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  CircleSlash,
  Clipboard,
  Clock,
  ClockFading,
  Map,
  Play,
} from "lucide-react";
import { DLogHeader } from "./DLogHeader";
import { makeOverlayHTML } from "@/components/DLogComponents/MapOverlay";
import indicator from "../../Components/Indicators.svg";
import { getLogDetail } from "@/Api/LogApi/getLogDetail";
import type { getLogDetailResponse } from "@/Api/LogApi/interfaces/getLogDetailResponse";

export function DLogDetails() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<kakao.maps.Map | null>(null);
  const [log, setLog] = useState<getLogDetailResponse | null>(null);
  const [startAddr, setStartAddr] = useState<string | null>(null);
  const [endAddr, setEndAddr] = useState<string | null>(null);

  // id값과 일치하는 데이터 fetch
  const navigate = useNavigate();
  const { Id } = useParams();

  useEffect(() => {
    if (!Id) return;
    getLogDetail({ id: Id })
      .then((log) => setLog(log))
      .catch((err) => {
        console.error("상세 기록 가져오기 실패", err);
      });
  }, [Id]);

  useEffect(() => {
    if (!log) return;

    // 위도, 경도값 fetch 및 LatLng 객체로 변환
    const startPosition = new kakao.maps.LatLng(log.startLat, log.startLng);
    const endPosition = new kakao.maps.LatLng(log.endLat, log.endLng);

    // geodecoder (좌표->주소) 객체 생성
    const geodecoder = new kakao.maps.services.Geocoder();

    geodecoder.coord2Address(
      startPosition.getLng(),
      startPosition.getLat(),
      (result, status) => {
        if (status === kakao.maps.services.Status.OK) {
          const Addr = result[0].address.address_name;
          setStartAddr(Addr);
        }
      }
    );
    geodecoder.coord2Address(
      endPosition.getLng(),
      endPosition.getLat(),
      (result, status) => {
        if (status === kakao.maps.services.Status.OK) {
          const Addr = result[0].address.address_name;
          setEndAddr(Addr);
        }
      }
    );
  }, [log]);

  useEffect(() => {
    if (!log || !containerRef.current || !log.record.length) return;

    const interval = setInterval(() => {
      if (window.kakao && window.kakao.maps) {
        clearInterval(interval);

        const kakao = window.kakao;

        const startPosition = new kakao.maps.LatLng(log.startLat, log.startLng);
        const endPosition = new kakao.maps.LatLng(log.endLat, log.endLng);
        const centerPosition = new kakao.maps.LatLng(
          (log.startLat + log.endLat) / 2,
          (log.startLng + log.endLng) / 2
        );

        const markerImage = new kakao.maps.MarkerImage(
          indicator,
          new kakao.maps.Size(28, 28),
          { offset: new kakao.maps.Point(14, 14) }
        );
        const startMarker = new kakao.maps.Marker({
          position: startPosition,
          image: markerImage,
        });
        const endMarker = new kakao.maps.Marker({
          position: endPosition,
          image: markerImage,
        });

        const startOverlay = new kakao.maps.CustomOverlay({
          position: startPosition,
          content: makeOverlayHTML(
            "start",
            startPosition.getLat(),
            startPosition.getLng()
          ),
          yAnchor: 1.2,
          xAnchor: 1.2,
        });
        const endOverlay = new kakao.maps.CustomOverlay({
          position: endPosition,
          content: makeOverlayHTML(
            "end",
            endPosition.getLat(),
            endPosition.getLng()
          ),
          yAnchor: -0.2,
          xAnchor: -0.2,
        });

        const map = new kakao.maps.Map(containerRef.current!, {
          center: centerPosition,
          level: 9,
        });
        mapRef.current = map;

  
        const path = log.record.map((k) => new kakao.maps.LatLng(k.lat, k.lng));
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

        if (
          startPosition.getLat() === endPosition.getLat() &&
          startPosition.getLng() === endPosition.getLng()
        ) {
          startOverlay.setMap(map);
          endOverlay.setMap(map);
        } else {
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
        }
      }
    }, 100);

    return () => clearInterval(interval);
  }, [log]);

  if (!Id) {
    return <div>잘못된 접근입니다</div>;
  }

  if (!log) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className="flex flex-col gap-6 py-6 md:py-8 w-full max-w-screen-xl mx-auto">
      <div className="w-full px-4 md:px-12 flex flex-wrap gap-3 justify-between items-center">
        <div className="flex items-center gap-3">
          <DLogHeader />
          <span className="whitespace-nowrap text-lg md:text-xl font-medium text-[#969696]">
            {log.vehicleNumber}, {log.vehicleName}
          </span>
        </div>
        <div
          onClick={() => navigate("/log")}
          className="flex font-bold cursor-pointer hover:bg-gray-400/10 px-1 py-1 rounded-[5px]"
        >
          <ArrowLeft />
          목록으로
        </div>
      </div>
      <div className="px-4 md:px-8 xl:px-20">
        <div className="flex flex-col gap-4 md:gap-5 w-full">
          {/* Row 1: all info cards in a single line */}
          <div className="flex flex-nowrap gap-4 md:gap-5 w-full items-stretch">
            {/* 시작 시간 */}
            <div className="flex-1 min-w-0 border rounded-[12px] border-[#000000]/10 shadow-md px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-6 justify-between gap-2 sm:gap-3 md:gap-4 flex flex-col shrink">
              <div className="flex items-center gap-2 sm:gap-3 font-bold text-sm sm:text-base md:text-lg">
                <Clock size={20} />
                시작 시간
              </div>
              <div className="text-[#969696] text-xs sm:text-sm md:text-base break-words whitespace-normal">
                {log.onTime.replace("T", " ")}
              </div>
            </div>
            {/* 종료 시간 */}
            <div className="flex-1 min-w-0 border rounded-[12px] border-[#000000]/10 shadow-md px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-6 justify-between gap-2 sm:gap-3 md:gap-4 flex flex-col shrink">
              <div className="flex items-center gap-2 sm:gap-3 font-bold text-sm sm:text-base md:text-lg">
                <ClockFading size={20} />
                종료 시간
              </div>
              <div className="text-[#969696] text-xs sm:text-sm md:text-base break-words whitespace-normal">
                {log.offTime.replace("T", " ")}
              </div>
            </div>
            {/* 총 운행거리 */}
            <div className="flex-1 min-w-0 border rounded-[12px] border-[#000000]/10 shadow-md px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-6 justify-between gap-2 sm:gap-3 md:gap-4 flex flex-col shrink">
              <div className="flex items-center gap-2 sm:gap-3 font-bold text-sm sm:text-base md:text-lg">
                <Clipboard size={20} />
                총 운행거리
              </div>
              <div className="text-[#969696] text-xs sm:text-sm md:text-base truncate">
                {(Number(log.sumDist) / 1000).toFixed(1).toLocaleString()} km
              </div>
            </div>
            {/* 시작/종료 주소 */}
            <div className="flex-[1.6] min-w-0 border rounded-[12px] border-[#000000]/10 shadow-md px-3 sm:px-5 md:px-8 py-3 sm:py-4 md:py-6 justify-between gap-3 md:gap-4 flex flex-col">
              <div className="flex gap-2 sm:gap-3 min-w-0">
                <div className="flex items-center gap-2 sm:gap-3 font-bold text-sm sm:text-base md:text-lg">
                  <Play size={20} />
                </div>
                <div className="text-[#969696] text-[11px] sm:text-xs md:text-sm break-words whitespace-normal">
                  {!startAddr ? "주소 불러오는 중.." : startAddr}
                </div>
              </div>
              <Separator orientation="vertical" className="hidden" />
              <Separator orientation="horizontal" className="" />
              <div className="flex gap-2 sm:gap-3 min-w-0">
                <div className="flex items-center gap-2 sm:gap-3 font-bold text-sm sm:text-base md:text-lg">
                  <CircleSlash size={20} />
                </div>
                <div className="text-[#969696] text-[11px] sm:text-xs md:text-sm break-words whitespace-normal">
                  {!endAddr ? "주소 불러오는 중.." : endAddr}
                </div>
              </div>
            </div>
          </div>
          {/* Row 2: map full width */}
          <div className="border rounded-[12px] border-[#000000]/10 shadow-md px-4 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6 justify-start gap-3 sm:gap-4 flex flex-col w-full">
            <div className="flex items-center gap-2 sm:gap-3 font-bold text-base sm:text-lg md:text-xl">
              <Map size={22} />
              운행 경로
            </div>
            <div
              ref={containerRef}
              id="map"
              className="w-full h-[260px] sm:h-[320px] md:h-[420px] lg:h-[520px] rounded-[6px]"
            ></div>
          </div>
        </div>
        <div className="mt-6" />
      </div>
      <div className="mt-6"></div>
    </div>
  );
}
