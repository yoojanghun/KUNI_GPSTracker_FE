import { useState, useEffect, useRef } from 'react';
import type { CarInfo, Position } from '@/Store/carStatus';
import { useCarStatusOptionStore, useLocationSearchMapStore, useTrackCarStore } from '@/Store/carStatus';
import { useKakaoLoader } from 'react-kakao-maps-sdk';

type CarWithPath = Omit<CarInfo, "path"> & { path: Position[]; };

type MapTestProps = {
  maxLevel: number;
}

function MapLocationSearch ({ maxLevel }: MapTestProps) {

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
  const notRunningMarkerRef = useRef<kakao.maps.MarkerImage | null>(null);
  const inspectedMarkerRef = useRef<kakao.maps.MarkerImage | null>(null);

  const activeInfoWindowRef = useRef<kakao.maps.InfoWindow | null>(null);

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
    if(!mapInstance.current) return;
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

    // 운행중 차량 마커 생성
    runningMarkerRef.current = new kakao.maps.MarkerImage(
      "/marker-working.png",
      new kakao.maps.Size(30, 42),
      {offset: new kakao.maps.Point(15, 30)}
    )

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

    // 미운행 차량 마커 생성
    notRunningMarkerRef.current = new kakao.maps.MarkerImage(
      "/marker-notWorking.png",
      new kakao.maps.Size(30, 42),
      {offset: new kakao.maps.Point(15, 30)}
    )

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

    // 수리중 차량 마커 생성
    inspectedMarkerRef.current = new kakao.maps.MarkerImage(
      "/marker-inspected.png",
      new kakao.maps.Size(30, 42),
      {offset: new kakao.maps.Point(15, 30)}
    )

  }, [])

  // 마커와 클러스터링 생성, 만들어진 마커로 지도 클러스터링
  useEffect(() => {
    if (!mapInstance.current) return;
    const kakao = (window as any).kakao;

    totalClustererRef.current?.clear();
    runningClustererRef.current?.clear();
    notRunningClustererRef.current?.clear();
    inspectedClustererRef.current?.clear();

    const createMarkersByStatus = (status: string, markerImage: kakao.maps.MarkerImage) =>
      positions
        .filter(p => p.status === status)
        .map(p => {
          const lastPoint = p.path[p.path.length - 1]; // 마지막 위치 객체

          // 1) Marker 생성
          const marker = new kakao.maps.Marker({
            position: new kakao.maps.LatLng(lastPoint.lat, lastPoint.lng),
            image: markerImage
          });

          // 2) InfoWindow 생성
          const iwContent = `
            <div style="padding:5px; font-size:1rem;">
              <span>${p.number}</span><br>
              <span>${p.name}</span><br>
              <span>${p.status}</span><br>
            </div>`;
          const infowindow = new kakao.maps.InfoWindow({ content: iwContent });
          
          // 3) 이벤트 리스너 등록 (마우스 올리면 열기)
          kakao.maps.event.addListener(marker, "mouseover", () => {
            infowindow.open(mapInstance.current, marker);
          })
          kakao.maps.event.addListener(marker, "mouseout", () => {
            if(activeInfoWindowRef.current !== infowindow){
              infowindow.close();
            }
          })

          // 4) 이벤트 리스너 등록 (클릭 => infoWindow 유지)
          kakao.maps.event.addListener(marker, "click", () => {
            if(activeInfoWindowRef.current === infowindow) {
              infowindow.close();
              activeInfoWindowRef.current = null;
            }
            else {
              if(activeInfoWindowRef.current) {
                activeInfoWindowRef.current.close();
              }
              infowindow.open(mapInstance.current, marker);
              activeInfoWindowRef.current = infowindow;
            }
          })

          return marker;
        }
    );

    const createMarkers = () => 
      positions
        .map(p => {
          const lastPoint = p.path[p.path.length-1];

          let markerImage: kakao.maps.MarkerImage | null = null;

          if(p.status === "운행중") markerImage = runningMarkerRef.current;
          else if(p.status === "미운행") markerImage = notRunningMarkerRef.current;
          else if(p.status === "수리중") markerImage = inspectedMarkerRef.current;
          else markerImage = null;

          // 1) Marker 생성
          const marker = new kakao.maps.Marker({
            position: new kakao.maps.LatLng(lastPoint.lat, lastPoint.lng),
            image: markerImage
          });

          // 2) InfoWindow 생성
          const iwContent = `
            <div style="padding:5px; font-size:1rem;">
              <span>${p.number}</span><br>
              <span>${p.name}</span><br>
              <span>${p.status}</span><br>
            </div>`;
          const infowindow = new kakao.maps.InfoWindow({ content: iwContent });
            
          // 3) 이벤트 리스너 등록 (마우스 올리면 열기)
          kakao.maps.event.addListener(marker, "mouseover", () => {
            infowindow.open(mapInstance.current, marker);
          })
          kakao.maps.event.addListener(marker, "mouseout", () => {
            if(activeInfoWindowRef.current !== infowindow){
              infowindow.close();
            }
          })

          // 4) 이벤트 리스너 등록 (클릭 => infoWindow 유지)
          kakao.maps.event.addListener(marker, "click", () => {
            if(activeInfoWindowRef.current === infowindow) {
              infowindow.close();
              activeInfoWindowRef.current = null;
            }
            else {
              if(activeInfoWindowRef.current) {
                activeInfoWindowRef.current.close();
              }
              infowindow.open(mapInstance.current, marker);
              activeInfoWindowRef.current = infowindow;
            }
          })

          return marker;
        })

    if (carStatusOption === "전체") {
      if(!runningMarkerRef.current) return;
      totalClustererRef.current?.addMarkers(createMarkers());
    }
    else if (carStatusOption === "운행중") {
      if(!runningMarkerRef.current) return;
      runningClustererRef.current?.addMarkers(createMarkersByStatus('운행중', runningMarkerRef.current));
    }
    else if (carStatusOption === "미운행") {
      if(!notRunningMarkerRef.current) return;
      notRunningClustererRef.current?.addMarkers(createMarkersByStatus('미운행', notRunningMarkerRef.current));
    }
    else {
      if(!inspectedMarkerRef.current) return;
      inspectedClustererRef.current?.addMarkers(createMarkersByStatus('수리중', inspectedMarkerRef.current));
    }

  }, [carStatusOption, positions]);

  return (
    <div ref={mapContainerRef} style={{ width: '100%', height: '100%'}}/>
  );
};

export default MapLocationSearch;