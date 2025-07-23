import { useState, useEffect, useRef } from 'react';
import type { CarInfo, Position } from '@/Store/carStatus';
import { useCarStatusOptionStore, useMapStore } from '@/Store/carStatus';
import { useKakaoLoader } from 'react-kakao-maps-sdk';

type CarWithPath = Omit<CarInfo, "path"> & { path: Position[]; };

type MapTestProps = {
  maxLevel: number;
}

function MapBasic ({ maxLevel }: MapTestProps) {

  const carStatusOption = useCarStatusOptionStore(state => state.carStatusOption);

  const mapCenter = useMapStore(state => state.mapCenter);
  const setMapCenter = useMapStore(state => state.setMapCenter);
  const mapLevel = useMapStore(state => state.mapLevel);
  const setMapLevel = useMapStore(state => state.setMapLevel);

  const [positions, setPositions] = useState<CarWithPath[]>([]);      // positions에는 차량들의 리스트 객체들이 들어감

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<kakao.maps.Map | null>(null);

  const totalClustererRef = useRef<kakao.maps.MarkerClusterer | null>(null);
  const runningClustererRef = useRef<kakao.maps.MarkerClusterer | null>(null);
  const notRunningClustererRef = useRef<kakao.maps.MarkerClusterer | null>(null);
  const inspectedClustererRef = useRef<kakao.maps.MarkerClusterer | null>(null);

  // 차량의 현재 위치 (예시 데이터)
  useEffect(() => {
    fetch("/carListExample.json")
    .then(res => res.json())
    .then(data => setPositions(data));
  }, []);

  useEffect(() => {
    // loading이 끝나고 에러가 없으며, ref가 유효할 때만 실행
    if (!mapContainerRef.current || mapInstance.current) return;

    // 지도 생성
    mapInstance.current = new kakao.maps.Map(mapContainerRef.current, {
      center: new kakao.maps.LatLng(mapCenter.lat, mapCenter.lng),
      level: mapLevel,
    });
    mapInstance.current.setMaxLevel(maxLevel);

    // zoom 컨트롤러 생성
    const zoomControl = new kakao.maps.ZoomControl();
    mapInstance.current.addControl(zoomControl, kakao.maps.ControlPosition.BOTTOMRIGHT);

    const mapCenterLevelEvent = () => {
      if(!mapInstance.current) return;
      const center = mapInstance.current.getCenter();
      setMapCenter({ lat: center.getLat(), lng: center.getLng()});
      setMapLevel(mapInstance.current.getLevel());
    }
    kakao.maps.event.addListener(mapInstance.current, "idle", mapCenterLevelEvent);

    // 전체 차량 클러스터러 생성
    totalClustererRef.current = new kakao.maps.MarkerClusterer({
      map: mapInstance.current,
      averageCenter: true,
      minLevel: 6,
        styles: [{
                  width : '50px', 
                  height : '50px',
                  backgroundColor: 'green',
                  borderRadius: '50%',
                  opacity: '0.7',
                  color: '#FFFFFF',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  lineHeight: '31px'
            }]
    });

    // 운행중 차량 클러스터러 생성
    runningClustererRef.current = new kakao.maps.MarkerClusterer({
      map: mapInstance.current,
      averageCenter: true,
      minLevel: 6,
      styles: [{
                width : '50px', 
                height : '50px',
                background: 'blue',
                borderRadius: '50%',
                opacity: '0.7',
                color: '#FFFFFF',
                textAlign: 'center',
                fontWeight: 'bold',
                lineHeight: '31px'
            }]
    });

    // 미운행 차량 클러스터러 생성
    notRunningClustererRef.current = new kakao.maps.MarkerClusterer({
      map: mapInstance.current,
      averageCenter: true,
      minLevel: 6,
      styles: [{
                width : '50px', 
                height : '50px',
                background: 'red',
                borderRadius: '50%',
                opacity: '0.7',
                color: '#000',
                textAlign: 'center',
                fontWeight: 'bold',
                lineHeight: '31px'
            }]
    });

    // 수리중 차량 클러스터러 생성
    inspectedClustererRef.current = new kakao.maps.MarkerClusterer({
      map: mapInstance.current,
      averageCenter: true,
      minLevel: 6,
      styles: [{
                width : '50px', 
                height : '50px',
                background: 'orange',
                borderRadius: '50%',
                opacity: '0.7',
                color: '#000',
                textAlign: 'center',
                fontWeight: 'bold',
                lineHeight: '31px'
            }]
    });

    // 리사이즈 대응
    const handleResize = () => {
      if (!mapInstance.current) return;
      kakao.maps.event.trigger(mapInstance.current!, 'resize');
      mapInstance.current!.panTo(
        new kakao.maps.LatLng(37.5665, 126.9780)
      );
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      kakao.maps.event.removeListener(mapInstance.current!, 'idle', mapCenterLevelEvent);
      mapInstance.current = null;
      runningClustererRef.current = null;
      notRunningClustererRef.current = null;
      inspectedClustererRef.current = null;
    };
  }, [mapCenter, mapLevel]);

  useEffect(() => {
    if (!mapInstance.current) return;
    const kakao = (window as any).kakao;

    // 이전 마커 클리어
    totalClustererRef.current?.clear();
    runningClustererRef.current?.clear();
    notRunningClustererRef.current?.clear();
    inspectedClustererRef.current?.clear();

    const createMarkers = (status: string, imageUrl: string) =>
      positions
        .filter(p => p.status === status)
        .map(p => {
          const lastPoint = p.path[p.path.length - 1]; // 마지막 위치 객체

          // 1) Marker 생성
          const marker = new kakao.maps.Marker({
            position: new kakao.maps.LatLng(lastPoint.lat, lastPoint.lng),
            image: new kakao.maps.MarkerImage(
              imageUrl,
              new kakao.maps.Size(30, 30),
              { offset: new kakao.maps.Point(15, 30) }
            )
          });

          // 2) InfoWindow 생성
          const iwContent = `
            <div style="padding:5px; font-size:1rem;">
              <span>${p.number}</span><br>
              <span>${p.name}</span><br>
              <span>${p.status}</span><br>
              <a href="https://map.kakao.com/link/map/${p.number},${lastPoint.lat},${lastPoint.lng}"
                style="color:blue; font-size: 0.8rem;" target="_blank">큰지도보기</a>
              <a href="https://map.kakao.com/link/to/${p.number},${lastPoint.lat},${lastPoint.lng}"
                style="color:blue; font-size: 0.8rem;" margin-left:4px;" target="_blank">길찾기</a>
            </div>`;
          const infowindow = new kakao.maps.InfoWindow({ content: iwContent });
          
          // 3) 이벤트 리스너 등록 (클릭하면 열기)
          kakao.maps.event.addListener(marker, "click", () => {
            if(infowindow.getMap()) {
              infowindow.close();
            }
            else {
              infowindow.open(mapInstance.current, marker);
            }
          })
          return marker;
        }
    );

    if (carStatusOption === "전체") {
      const allMarkers = positions
        .map(p => {
          const lastPoint = p.path[p.path.length - 1];

          // 1) Marker 생성
          const marker = new kakao.maps.Marker({
            position: new kakao.maps.LatLng(lastPoint.lat, lastPoint.lng),
            image: new kakao.maps.MarkerImage(
              "/vite.svg",
              new kakao.maps.Size(30, 30),
              { offset: new kakao.maps.Point(15, 30) }
            )
          });

          // 2) InfoWindow 생성
          const iwContent = `
            <div style="padding:5px; font-size: 1rem;">
              <span>${p.number}</span><br>
              <span>${p.name}</span><br>
              <span>${p.status}</span><br>
              <a href="https://map.kakao.com/link/to/${p.number},${lastPoint.lat},${lastPoint.lng}"
                style="color:blue; font-size: 0.8rem;" target="_blank">길찾기</a>
            </div>`;
          const infowindow = new kakao.maps.InfoWindow({ content: iwContent });

          // 3) 이벤트 리스너 등록 (클릭하면 열기)
          kakao.maps.event.addListener(marker, "click", () => {
            if (infowindow.getMap()) {
              infowindow.close();
            } 
            else {
              infowindow.open(mapInstance.current, marker);
            }
          });
          return marker;
        });

      // 4) 클러스터러에 마커 추가
      totalClustererRef.current?.addMarkers(allMarkers);
    }
    else if (carStatusOption === "운행중") {
      runningClustererRef.current?.addMarkers(createMarkers('운행중', '/vite.svg'));
    }
    else if (carStatusOption === "미운행") {
      notRunningClustererRef.current?.addMarkers(createMarkers('미운행', '/vite.svg'));
    }
    else {
      inspectedClustererRef.current?.addMarkers(createMarkers('수리중', '/vite.svg'));
    }

  }, [carStatusOption, positions, mapCenter, mapLevel]);
  // 옵션창에서 carStatus를 바꾸거나, 차량 데이터가 변경되어 positions가 바뀌거나 => 마커 다시 로드

  return (
    <div ref={mapContainerRef} style={{ width: '100%', height: '100%'}}/>
  );
};

export default MapBasic;