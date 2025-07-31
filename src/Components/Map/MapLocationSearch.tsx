import { useState, useEffect, useRef } from 'react';
import { 
  type CarInfo, 
  type Position, 
  useCarStatusOptionStore, 
  useLocationSearchMapStore, 
  useSelectCarStore, 
  useTrackCarStore 
} from '@/Store/carStatus';
import styles from "./MapCustomOverlay.module.css";
import {} from 'react-kakao-maps-sdk';

type CarWithPath = Omit<CarInfo, "path"> & { path: Position[]; };

type MapTestProps = {
  maxLevel: number;
}

type CustomOverlayStyle = {
  default: kakao.maps.MarkerImage, 
  hover: kakao.maps.MarkerImage,
  bgColor: string,
  textColor: string,
}

function MapLocationSearch ({ maxLevel }: MapTestProps) {

  const selectedCar = useSelectCarStore(state => state.selectedCar);
  const setSelectedCar = useSelectCarStore(state => state.setSelectedCar);
  const carStatusOption = useCarStatusOptionStore(state => state.carStatusOption);
  const locationSearchMapCenter = useLocationSearchMapStore(state => state.locationSearchMapCenter);
  const setLocationSearchMapCenter = useLocationSearchMapStore(state => state.setLocationSearchMapCenter);
  const locationSearchMapLevel = useLocationSearchMapStore(state => state.locationSearchMapLevel);
  const setlLocationSearchMapLevel = useLocationSearchMapStore(state => state.setLocationSearchMapLevel);
  const mapCenterCarList = useTrackCarStore(state => state.mapCenterCarList);
  const mapLevelCarList = useTrackCarStore(state => state.mapLevelCarList);

  const [positions, setPositions] = useState<CarWithPath[]>([]);      // positions에는 차량들의 리스트 객체들이 들어감

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<kakao.maps.Map | null>(null);

  const totalClustererRef = useRef<kakao.maps.MarkerClusterer | null>(null);
  const runningClustererRef = useRef<kakao.maps.MarkerClusterer | null>(null);
  const notRunningClustererRef = useRef<kakao.maps.MarkerClusterer | null>(null);
  const inspectedClustererRef = useRef<kakao.maps.MarkerClusterer | null>(null);

  const runningMarkerRef = useRef<kakao.maps.MarkerImage | null>(null);
  const runningHoverMarkerRef = useRef<kakao.maps.MarkerImage | null>(null);
  const notRunningMarkerRef = useRef<kakao.maps.MarkerImage | null>(null);
  const notRunningHoverMarkerRef = useRef<kakao.maps.MarkerImage | null>(null);
  const inspectedMarkerRef = useRef<kakao.maps.MarkerImage | null>(null);
  const inspectedHoverMarkerRef = useRef<kakao.maps.MarkerImage | null>(null);

  const activeOverlayRef = useRef<kakao.maps.CustomOverlay | null>(null);
  const activeMarkerRef = useRef<kakao.maps.Marker | null>(null);
  const activeMarkerImgRef = useRef<kakao.maps.MarkerImage | null>(null);

  // 차량의 현재 위치 (예시 데이터)
  useEffect(() => {
    fetch("/carListExample.json")
    .then(res => res.json())
    .then(data => setPositions(data));
  }, []);

  // carList에서 차량 클릭 시 기존 지도 인스턴스의 center/level 만 변경
  useEffect(() => {
    if(!mapInstance.current) return;
    const target = new kakao.maps.LatLng(
      mapCenterCarList.lat,
      mapCenterCarList.lng
    );
    mapInstance.current.setLevel(mapLevelCarList);
    mapInstance.current.setCenter(target);
  }, [mapCenterCarList, mapLevelCarList]);

  // 지도 생성, 지도에서 중심좌표 레벨 추적 후 상태 저장
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // 지도 생성
    mapInstance.current = new kakao.maps.Map(mapContainerRef.current, {
      center: new kakao.maps.LatLng(locationSearchMapCenter.lat, locationSearchMapCenter.lng),
      level: locationSearchMapLevel,
    });
    mapInstance.current.setMaxLevel(maxLevel);

    // 지도에서 중심좌표 레벨 추적 후 상태 저장
    const mapCenterLevelEvent = () => {
      if(!mapInstance.current) return;
      const center = mapInstance.current.getCenter();
      setLocationSearchMapCenter({ lat: center.getLat(), lng: center.getLng()});
      setlLocationSearchMapLevel(mapInstance.current.getLevel());
    }
    kakao.maps.event.addListener(mapInstance.current, "idle", mapCenterLevelEvent);

    // 화면에서 드래그 범위를 벗어나면 지도의 중심으로 다시 위치
    const bounds = new kakao.maps.LatLngBounds(
      new kakao.maps.LatLng(33.0, 124.0),     // SouthWest
      new kakao.maps.LatLng(39.0, 132.0)      // NorthEast
    );

    kakao.maps.event.addListener(mapInstance.current, "dragend", () => {
      if (!mapInstance.current) return;

      const center = mapInstance.current.getCenter();

      if (!bounds.contain(center)) {
        const sw = bounds.getSouthWest();
        const ne = bounds.getNorthEast();
        const boundedCenter = new kakao.maps.LatLng(
          (sw.getLat() + ne.getLat()) / 2,
          (sw.getLng() + ne.getLng()) / 2
        );
        mapInstance.current.panTo(boundedCenter);
      }
    });

    // zoom 컨트롤러 생성
    const zoomControl = new kakao.maps.ZoomControl();
    mapInstance.current.addControl(zoomControl, kakao.maps.ControlPosition.BOTTOMRIGHT);

    return () => {
      kakao.maps.event.removeListener(mapInstance.current!, 'idle', mapCenterLevelEvent);
    };
  }, []);

  // 차량별 클러스터링, 차량별 마커 디자인
  useEffect(() => {
    const clusterers = [
      { clustererRef: totalClustererRef, backgroundColor: 'hsla(121, 41%, 45%, 0.8)' },
      { clustererRef: runningClustererRef, backgroundColor: 'hsla(217, 89%, 65%, 0.8)' },
      { clustererRef: notRunningClustererRef, backgroundColor: 'hsla(5, 80%, 58%, 0.8)' },
      { clustererRef: inspectedClustererRef, backgroundColor: 'hsla(35, 100%, 58%, 0.8)' },
    ]

    clusterers.forEach(({ clustererRef, backgroundColor }) => {
      if(!mapInstance.current) return;
      clustererRef.current = new kakao.maps.MarkerClusterer({
      map: mapInstance.current,
      averageCenter: true,
      minLevel: 7,
      styles: [{
                width : '60px', 
                height : '60px',
                fontSize: "1.2em",
                color: 'white',
                backgroundColor: backgroundColor,
                borderRadius: '50%',
                fontWeight: 'bold',
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
              }]
      })
    })
    
    const markers = [
      { markerRef: runningMarkerRef, hoverMarkerRef: runningHoverMarkerRef, url: "/marker-working.png" },
      { markerRef: notRunningMarkerRef, hoverMarkerRef: notRunningHoverMarkerRef, url: "/marker-notWorking.png" },
      { markerRef: inspectedMarkerRef, hoverMarkerRef: inspectedHoverMarkerRef, url: "/marker-inspected.png" },
    ]

    markers.forEach(({ markerRef, hoverMarkerRef, url }) => {
      markerRef.current = new kakao.maps.MarkerImage(
        url,
        new kakao.maps.Size(30, 42),
        { offset: new kakao.maps.Point(15, 30) }
      )

      hoverMarkerRef.current = new kakao.maps.MarkerImage(
        url,
        new kakao.maps.Size(36, 50),
        { offset: new kakao.maps.Point(18, 37) }
      )
    })
  }, [])

  // customOverlay, marker, cluster을 제외한 지도의 다른 부분을 클릭 => customOverlay 삭제 
  useEffect(() => {
    if(!mapInstance.current) return;
    const removeOverlayMap = () => {
      if(activeOverlayRef.current) {
        activeOverlayRef.current.setMap(null);
      }
      if(activeMarkerRef.current && activeMarkerImgRef.current) {
        activeMarkerRef.current.setImage(activeMarkerImgRef.current);
      }
      activeOverlayRef.current = null;
      activeMarkerRef.current = null;
      activeMarkerImgRef.current = null;
    }
    kakao.maps.event.addListener(mapInstance.current, "click", removeOverlayMap)

    return () => {
      if(!mapInstance.current) return;
      kakao.maps.event.removeListener(mapInstance.current, "click", removeOverlayMap)
    }
  }, [])

  // 마커와 클러스터링 생성, 만들어진 마커로 지도 클러스터링
  useEffect(() => {
    if (!mapInstance.current) return;
    const kakao = (window as any).kakao;

    totalClustererRef.current?.clear();
    runningClustererRef.current?.clear();
    notRunningClustererRef.current?.clear();
    inspectedClustererRef.current?.clear();

    activeOverlayRef.current?.setMap(null);
    activeMarkerRef.current = null;
    activeMarkerImgRef.current = null;

    if(!runningMarkerRef.current || !runningHoverMarkerRef.current || !notRunningMarkerRef.current || 
        !notRunningHoverMarkerRef.current || !inspectedMarkerRef.current || !inspectedHoverMarkerRef.current) return;

    const markerMap: Record<string, CustomOverlayStyle> = {
      "운행중": {
        default: runningMarkerRef.current, 
        hover: runningHoverMarkerRef.current, 
        bgColor: "bg-[#c1d8ff]", 
        textColor: "text-[#5491f5]"
      },
      "미운행": {
        default: notRunningMarkerRef.current, 
        hover: notRunningHoverMarkerRef.current, 
        bgColor: "bg-[#ffcac6]", 
        textColor: "text-[#e94b3e]"
      },
      "수리중": {
        default: inspectedMarkerRef.current, 
        hover: inspectedHoverMarkerRef.current, 
        bgColor: "bg-[#ffe4be]", 
        textColor: "text-[#ffa62a]"
      }
    }

    const makeMarkers = (status?: string) => {
      return positions
        .filter(p => p.status === status || !status)
        .map(p => {
          const lastPoint = p.path[p.path.length - 1]; 
          const {default: defaultImg, hover: hoverImg} = markerMap[p.status];

          // 1) Marker 생성
          const marker = new kakao.maps.Marker({
            position: new kakao.maps.LatLng(lastPoint.lat, lastPoint.lng),
            image: defaultImg
          });

          // 2) CustomOverlay 생성
          const overlay = new kakao.maps.CustomOverlay({
            content: `
              <div class="${styles["overlay-bubble"]}">
                <div class="px-3 py-1 text-center">
                  <div class="font-bold">${p.number}</div>
                  <div class="font-bold my-1">${p.name}</div>
                  <div class="${markerMap[p.status].bgColor} ${markerMap[p.status].textColor} p-1 font-bold rounded-sm text-center">
                    ${p.status}
                  </div>
                </div>
              </div>`,
            position: marker.getPosition(),
            xAnchor: 0.55,    
            yAnchor: 1.5,
            zIndex: 99
          });

          if(selectedCar?.number === p.number) {
            marker.setImage(hoverImg);
            overlay.setMap(mapInstance.current);
            activeOverlayRef.current = overlay;
            activeMarkerRef.current = marker;
            activeMarkerImgRef.current = defaultImg;
          }

          // 3) 이벤트 리스너 등록 (마우스 올리면 열기)
          kakao.maps.event.addListener(marker, "mouseover", () => {
            marker.setImage(hoverImg);
            overlay.setMap(mapInstance.current);
          })
          kakao.maps.event.addListener(marker, "mouseout", () => {
            if(activeOverlayRef.current !== overlay) {
              marker.setImage(defaultImg);
              overlay.setMap(null);
            }
          });

          // 4) 이벤트 리스너 등록 (마커 클릭 => customOverlay 유지)
          kakao.maps.event.addListener(marker, "click", () => {
            if(activeOverlayRef.current === overlay) {
              overlay.setMap(null);
              activeOverlayRef.current = null;
              activeMarkerRef.current = null;
              activeMarkerImgRef.current = null;
            }
            else {
              if(activeOverlayRef.current) {
                activeOverlayRef.current.setMap(null);
              }
              if(activeMarkerRef.current && activeMarkerImgRef.current) {
                activeMarkerRef.current.setImage(activeMarkerImgRef.current);
              }
              marker.setImage(hoverImg);
              overlay.setMap(mapInstance.current);
              activeOverlayRef.current = overlay;
              activeMarkerRef.current = marker;
              activeMarkerImgRef.current = defaultImg;
              setSelectedCar(p);
            }
          });
          return marker;
        })
    }    

    if (carStatusOption === "전체") {
        totalClustererRef.current?.addMarkers(makeMarkers());
    }
    else{
      if(!runningClustererRef.current || !notRunningClustererRef.current || 
          !inspectedClustererRef.current) return;

      const mapRef: Record<string, kakao.maps.MarkerClusterer> = {
        "운행중": runningClustererRef.current,
        "미운행": notRunningClustererRef.current,
        "수리중": inspectedClustererRef.current
      }
      mapRef[carStatusOption].addMarkers(makeMarkers(carStatusOption));
    }
  }, [carStatusOption, positions, selectedCar]);

  return (
    <div ref={mapContainerRef} style={{ width: '100%', height: '100%'}}/>
  );
};

export default MapLocationSearch;