import { useState, useEffect, useRef, useMemo } from 'react';
import { 
  type CarInfo,
  type Position,
  useCarStatusBtnStore, 
  useHomeMapStore 
} from '@/Store/carStatus';
import styles from "./MapCustomOverlay.module.css";

type CarWithPath = Omit<CarInfo, "path"> & { path: Position[]; };

type MapTestProps = {
  maxLevel: number;
}

type CustomOverlayStyle = {
  defaultMarkerImg: kakao.maps.MarkerImage,
  hoverMarkerImg: kakao.maps.MarkerImage,
  bgColor: string,
  textColor: string,
}

function MapHome ({ maxLevel }: MapTestProps) {

  const carStatusBtn = useCarStatusBtnStore(state => state.carStatusBtn);
  const homeMapCenter = useHomeMapStore(state => state.homeMapCenter);
  const setHomeMapCenter = useHomeMapStore(state => state.setHomeMapCenter);
  const homeMapLevel = useHomeMapStore(state => state.homeMapLevel);
  const setHomeMapLevel = useHomeMapStore(state => state.setHomeMapLevel);

  const [positions, setPositions] = useState<CarWithPath[]>([]);      // positions에는 차량들의 리스트 객체들이 들어감

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<kakao.maps.Map | null>(null);
  const zoomControlRef = useRef<kakao.maps.ZoomControl | null>(null);

  const totalClustererRef = useRef<kakao.maps.MarkerClusterer | null>(null);
  const runningClustererRef = useRef<kakao.maps.MarkerClusterer | null>(null);
  const notRunningClustererRef = useRef<kakao.maps.MarkerClusterer | null>(null);
  const inspectedClustererRef = useRef<kakao.maps.MarkerClusterer | null>(null);

  const activeOverlayRef = useRef<kakao.maps.CustomOverlay | null>(null);
  const activeMarkerRef = useRef<kakao.maps.Marker | null>(null);
  const activeMarkerImgRef = useRef<kakao.maps.MarkerImage | null>(null);

  const markersRef = useRef<Record<string, kakao.maps.Marker>>({});
  const overlayRef = useRef<Record<string, kakao.maps.CustomOverlay>>({});

  // 차량의 현재 위치 (예시 데이터)
  useEffect(() => {
    fetch("/carListExample.json")
    .then(res => res.json())
    .then(data => setPositions(data));
  }, []);

  // 단순 계산(입력과 출력만 있는 것)
  // => useMemo
  const markerMap = useMemo<Record<string, CustomOverlayStyle>>(() => ({
    "운행중": {
      defaultMarkerImg: new kakao.maps.MarkerImage(
        "/marker-working.png",
        new kakao.maps.Size(30, 42),
        { offset: new kakao.maps.Point(15, 30) }
      ),
      hoverMarkerImg: new kakao.maps.MarkerImage(
        "/marker-working.png",
        new kakao.maps.Size(36, 50),
        { offset: new kakao.maps.Point(18, 37) }
      ),
      bgColor: "bg-[#c1d8ff]", 
      textColor: "text-[#5491f5]"
      },
    "미운행": {
      defaultMarkerImg: new kakao.maps.MarkerImage(
        "/marker-notWorking.png",
        new kakao.maps.Size(30, 42),
        { offset: new kakao.maps.Point(15, 30) }
      ),
      hoverMarkerImg: new kakao.maps.MarkerImage(
        "/marker-notWorking.png",
        new kakao.maps.Size(36, 50),
        { offset: new kakao.maps.Point(18, 37) }
      ),
      bgColor: "bg-[#ffcac6]", 
      textColor: "text-[#e94b3e]"
    },
    "점검중": {
      defaultMarkerImg: new kakao.maps.MarkerImage(
        "/marker-inspected.png",
        new kakao.maps.Size(30, 42),
        { offset: new kakao.maps.Point(15, 30) }
      ),
      hoverMarkerImg: new kakao.maps.MarkerImage(
        "/marker-inspected.png",
        new kakao.maps.Size(36, 50),
        { offset: new kakao.maps.Point(18, 37) }
      ),
      bgColor: "bg-[#ffe4be]", 
      textColor: "text-[#ffa62a]"
    }
  }), [])
  
  // 지도 생성, 지도에서 중심좌표 레벨 추적 후 상태 저장
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // 지도 생성
    mapInstance.current = new kakao.maps.Map(mapContainerRef.current, {
      center: new kakao.maps.LatLng(homeMapCenter.lat, homeMapCenter.lng),
      level: homeMapLevel,
    });
    mapInstance.current.setMaxLevel(maxLevel);

    // 지도에서 중심좌표 레벨 추적 후 상태 저장
    const mapCenterLevelEvent = () => {
      if(!mapInstance.current) return;
      const center = mapInstance.current.getCenter();
      setHomeMapCenter({ lat: center.getLat(), lng: center.getLng()});
      setHomeMapLevel(mapInstance.current.getLevel());
    }
    kakao.maps.event.addListener(mapInstance.current, "idle", mapCenterLevelEvent);

    // 화면에서 드래그 범위를 벗어나면 지도의 중심으로 다시 위치
    const bounds = new kakao.maps.LatLngBounds(
      new kakao.maps.LatLng(33.0, 124.0),     // SouthWest
      new kakao.maps.LatLng(39.0, 132.0)      // NorthEast
    );

    const preventDrag = () => {
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
    }
    kakao.maps.event.addListener(mapInstance.current, "dragend", preventDrag);

    // zoom 컨트롤러 생성
    const zoomControl = new kakao.maps.ZoomControl();
    mapInstance.current.addControl(zoomControl, kakao.maps.ControlPosition.BOTTOMRIGHT);
    zoomControlRef.current = zoomControl;

    return () => {
      if(!mapInstance.current || !zoomControlRef.current) return;
      kakao.maps.event.removeListener(mapInstance.current, 'idle', mapCenterLevelEvent);
      kakao.maps.event.removeListener(mapInstance.current, "dragend", preventDrag);
      mapInstance.current.removeControl(zoomControlRef.current);
    };
  }, []);

  // 차량별 클러스터링, 차량별 마커 디자인 
  // => 클러스터 생성하고 페이지 렌더링 후, 지도에 붙여넣기 때문에 useEffect
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

    return () => {
      [totalClustererRef, runningClustererRef, notRunningClustererRef, inspectedClustererRef].forEach(ref => {
        if(!ref.current) return;
        ref.current.clear();
        ref.current.setMap(null);
      })
    }
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

  useEffect(() => {
    const currentCars = positions.map(p => p.number);         // 현재 차량의 number을 가져옴

    totalClustererRef.current?.clear();
    runningClustererRef.current?.clear();
    notRunningClustererRef.current?.clear();
    inspectedClustererRef.current?.clear();

    activeOverlayRef.current?.setMap(null);
    activeMarkerRef.current = null;
    activeMarkerImgRef.current = null;

    const offHandlers: Array<() => void> = [];                // removeListener는 undefined를 반환

    const makeMarkers = (status?: string): kakao.maps.Marker[] => {
      const createdMarkers:kakao.maps.Marker[] = [];            // 생성된 마커의 배열을 반환하기 위해 사용
      positions
        .filter(p => p.status === status || !status)
        .forEach(p => {
          const lastPoint = p.path[p.path.length - 1];
          const latLng = new kakao.maps.LatLng(lastPoint.lat, lastPoint.lng);
          const { 
            defaultMarkerImg: defaultImg, 
            hoverMarkerImg: hoverImg, 
            bgColor, 
            textColor
          } = markerMap[p.status];

          let marker = markersRef.current[p.number];            // markersRef: 지도에 표시된 마커 (차량 번호: {마커})
          if(marker) {                                          // 해당 차량이 이미 있으면 지도에 이미 있는 marker와 overlay의 
            marker.setPosition(latLng);                         // 위치 업데이트 (열어서 보여주는 동작X)            
            marker.setImage(defaultImg);                          
            if(overlayRef.current[p.number]) {
              overlayRef.current[p.number].setPosition(latLng);   // overlay위치를 업데이트 (열어서 보여주는 동작X)
            }
          }
          else {
            if(!mapInstance.current) return;                    // markerRef에 해당 차량의 marker가 없으면 추가
            marker = new kakao.maps.Marker({                    // 실제로 marker를 지도에 띄우는 코드 (한 번만 실행)
              position: latLng,
              image: defaultImg,
              map: mapInstance.current
            });

            const overlay = new kakao.maps.CustomOverlay({            // 오버레이 생성 (한 번만 실행)
              content: `
                <div class="${styles["overlay-bubble"]}">
                  <div class="px-3 py-1 text-center">
                    <div class="font-bold">${p.number}</div>
                    <div class="font-bold my-1">${p.name}</div>
                    <div class="${bgColor} ${textColor} p-1 font-bold rounded-sm text-center">
                      ${p.status}
                    </div>
                  </div>
                </div>`,
              position: latLng,
              xAnchor: 0.55,    
              yAnchor: 1.5,
              zIndex: 99
            });

            overlayRef.current[p.number] = overlay;         // overlayRef: 지도에 표시할 오버레이 (차량 번호: {오버레이})

            const setOverlay = () => {                      // event 등록도 한 번만 실행
              marker.setImage(hoverImg);
              overlay.setMap(mapInstance.current);
            }
            const deleteOverlay = () => {
              if(activeOverlayRef.current !== overlay) {
                marker.setImage(defaultImg);
                overlay.setMap(null);
              }
            }
            const controlClickOverlay = () => {
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
              }
            }
            kakao.maps.event.addListener(marker, "mouseover", setOverlay);
            offHandlers.push(() => kakao.maps.event.removeListener(marker, "mouseover", setOverlay));

            kakao.maps.event.addListener(marker, "mouseout", deleteOverlay);
            offHandlers.push(() => kakao.maps.event.removeListener(marker, "mouseout", deleteOverlay));

            kakao.maps.event.addListener(marker, "click", controlClickOverlay);
            offHandlers.push(() => kakao.maps.event.removeListener(marker, "click", controlClickOverlay));

            markersRef.current[p.number] = marker;
          }
          createdMarkers.push(marker);        // createdMarkers에 마커의 배열이 들어감
        });
      
      return createdMarkers;
    }

    Object.keys(markersRef.current).forEach(key => {      // markersRef의 number 배열에 현재 차량(currentCars) number가 포함이 안되었을 때 삭제
      if(!currentCars.includes(key)) {
        markersRef.current[key].setMap(null);
        overlayRef.current[key].setMap(null);
        delete markersRef.current[key];
        delete overlayRef.current[key];
      }
    })

    if(carStatusBtn === "전체") {
      totalClustererRef.current?.addMarkers(makeMarkers());
    }
    else {
      if(!runningClustererRef.current || !notRunningClustererRef.current || !inspectedClustererRef.current) return;
      const clustererRef: Record<string, kakao.maps.MarkerClusterer> = {
        "운행중": runningClustererRef.current,
        "미운행": notRunningClustererRef.current,
        "점검중": inspectedClustererRef.current
      }
      clustererRef[carStatusBtn].addMarkers(makeMarkers(carStatusBtn))
    }

    return () => {
      offHandlers.forEach(off => off());
      Object.values(markersRef.current).forEach(marker => marker.setMap(null));
      Object.values(overlayRef.current).forEach(overlay => overlay.setMap(null));
      markersRef.current = {};
      overlayRef.current = {};
    };
  }, [positions, carStatusBtn])

  return (
    <div ref={mapContainerRef} style={{ width: '100%', height: '100%'}}/>
  );
};

export default MapHome;