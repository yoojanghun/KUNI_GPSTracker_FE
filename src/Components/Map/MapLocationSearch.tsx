import { useEffect, useRef, useMemo } from 'react';
import { 
  useAllCarLocationStore,
  useVisibleCarLocationStore
} from '@/Store/Map/locationSearchTotalCarsLoc';
import { 
  useSelectCarStore, 
  useCarListPageStore,
  useTrackCarStore,
  useCarStatusOptionStore, 
  useSelectedCarLatLng, 
} from '@/Store/LocationSearch/carList';
import { 
  useLocationSearchMapStore,
} from '@/Store/LocationSearch/mapState';
import styles from "./MapCustomOverlay.module.css";
import {} from 'react-kakao-maps-sdk';
import { prcInterval } from 'precision-timeout-interval';
import type { CarInfo } from '@/Store/Map/homeTotalCarsLoc';

type MapTestProps = {
  maxLevel: number;
}

type CustomOverlayStyle = {
  defaultMarkerImg: kakao.maps.MarkerImage;
  hoverMarkerImg: kakao.maps.MarkerImage;
  bgColor: string;
  textColor: string;
  statusName: string;
}

function MapLocationSearch ({ maxLevel }: MapTestProps) {

  const selectedCar = useSelectCarStore(state => state.selectedCar);
  const setSelectedCar = useSelectCarStore(state => state.setSelectedCar);
  const setCarListPage = useCarListPageStore(state => state.setCarListPage);
  const carStatusOption = useCarStatusOptionStore(state => state.carStatusOption);
  const locationSearchMapCenter = useLocationSearchMapStore(state => state.locationSearchMapCenter);
  const setLocationSearchMapCenter = useLocationSearchMapStore(state => state.setLocationSearchMapCenter);
  const locationSearchMapLevel = useLocationSearchMapStore(state => state.locationSearchMapLevel);
  const setLocationSearchMapLevel = useLocationSearchMapStore(state => state.setLocationSearchMapLevel);
  const mapCenterCarList = useTrackCarStore(state => state.mapCenterCarList);
  const mapLevelCarList = useTrackCarStore(state => state.mapLevelCarList);
  const selectedCarLatLng = useSelectedCarLatLng(state => state.latLng);

  const allCarLocations = useAllCarLocationStore(state => state.allCarLocations);
  const allCarsPolling = useAllCarLocationStore(state => state.allCarsPolling);
  const visibleCarLocations = useVisibleCarLocationStore(state => state.visibleCarLocations);
  const visibleCarsPolling = useVisibleCarLocationStore(state => state.visibleCarsPolling);

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
  const selectedMarkerNumRef = useRef<string | null>(null);
  const overlayRef = useRef<Record<string, kakao.maps.CustomOverlay>>({});

  const intervalCtrl = useRef<ReturnType<typeof prcInterval> | null> (null);
  const stepRef = useRef<number>(0);
  const isBusy = useRef<boolean>(false);
  const allCarsRef = useRef<CarInfo[]>([]);
  const targetedCars = useRef<string[]>([]);

  // 아래 코드에서 그냥 allCarsRef.current대신 allCarLocations로 쓰면 최신 allCarLocations를 
  // 반영하지 못할 수 있다. 따라서 useRef로 관리.
  useEffect(() => {
    allCarsRef.current = allCarLocations;
  }, [allCarLocations]);

  useEffect(() => {
    const map = mapInstance.current;
    if(!map) return;
    const firstFetch = async () => {
      isBusy.current = true;
      try {
        await allCarsPolling();
        stepRef.current += 1;
        console.log("전체 차량 gps");
      }
      catch(e) {
        console.error(e);
      }
      finally {
        isBusy.current = false;
      }
    }

    if(stepRef.current === 0) {
      void firstFetch();
    }

    intervalCtrl.current = prcInterval(3000, async () => {
      if(isBusy.current) return;
      isBusy.current = true;      // true => 나 지금 바쁘다
      try {
        if(!map) return;
        if(stepRef.current === 0) {
          await allCarsPolling();
          stepRef.current += 1;
          console.log("전체 차량 gps");
        }
        else if(stepRef.current > 0 && stepRef.current < 3 && map.getLevel() <= 8) {
          await visibleCarsPolling();
          stepRef.current += 1;
          console.log("보이는 차량 gps");
          if(stepRef.current === 3) {
            stepRef.current = 0;
          }
        }
      }
      catch(e) {
        console.error(e);
      }
      finally {
        isBusy.current = false;   // 다 끝났고 안 바쁘다
      }
    });

    const mapCornerGpsEvent = () => {
      if(!map) return;
      if(map.getLevel() > 8) return;
      const bounds = map.getBounds();
      targetedCars.current = allCarsRef.current
        .filter(carObj => bounds.contain(new kakao.maps.LatLng(carObj.latitude, carObj.longitude)))
        .map(carObj => carObj.vehicleNumber);
    }
    kakao.maps.event.addListener(map, "idle", mapCornerGpsEvent);

    return () => {
      intervalCtrl.current?.cancel();
      if(!map) return;
      kakao.maps.event.removeListener(map, "idle", mapCornerGpsEvent);
    };
  }, []);

  const markerMap = useMemo<Record<string, CustomOverlayStyle>>(() => ({
    "ACTIVE": {
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
      textColor: "text-[#5491f5]",
      statusName: "운행중"
    },
    "INACTIVE": {
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
      textColor: "text-[#e94b3e]",
      statusName: "미운행"
    },
    "INSPECTING": {
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
      textColor: "text-[#ffa62a]",
      statusName: "점검중"
    }
  }), []);

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
      setLocationSearchMapLevel(mapInstance.current.getLevel());
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
      gridSize: 140,
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
      selectedMarkerNumRef.current = null;
      setSelectedCar(null);
    }
    kakao.maps.event.addListener(mapInstance.current, "click", removeOverlayMap)

    return () => {
      if(!mapInstance.current) return;
      kakao.maps.event.removeListener(mapInstance.current, "click", removeOverlayMap)
    }
  }, [])

  // 마커와 클러스터링 생성, 만들어진 마커로 지도 클러스터링
  useEffect(() => {
    // 모든 차량(500대)의 차량 번호를 가져옴
    const currentCars = allCarLocations.map(car => car.vehicleNumber);

    totalClustererRef.current?.clear();
    runningClustererRef.current?.clear();
    notRunningClustererRef.current?.clear();
    inspectedClustererRef.current?.clear();
    
    // activeOverlayRef.current?.setMap(null);
    activeMarkerRef.current = null;
    activeMarkerImgRef.current = null;
    
    // const offHandlers: Array<() => void> = [];
    const makeMarkers = (status?: string) => {
      const createdMarkers: kakao.maps.Marker[] = [];
      allCarLocations
        .filter(car => car.status === status || !status)
        .forEach(car => {
          const latLng = new kakao.maps.LatLng(car.latitude, car.longitude);
          const {
            defaultMarkerImg: defaultImg,
            hoverMarkerImg: hoverImg,
            bgColor,
            textColor,
            statusName
          } = markerMap[car.status];

          let marker = markersRef.current[car.vehicleNumber];   

          // 저장된 마커가 존재할 때
          if(marker) {
            if(car.vehicleNumber === selectedCar?.vehicleNumber) {
              const overlay = overlayRef.current[car.vehicleNumber];
              marker.setImage(hoverImg);
              overlay.setMap(mapInstance.current);
              activeOverlayRef.current = overlay;
              activeMarkerRef.current = marker;
              activeMarkerImgRef.current = defaultImg;
            }
            else {  // marker(지도에 이미 표시된 차량)가 존재하고, selectedMarkersRef에 없으면
              marker.setPosition(latLng);
              marker.setImage(defaultImg);
              if(overlayRef.current[car.vehicleNumber]) {
                overlayRef.current[car.vehicleNumber].setPosition(latLng);
              }
            }
          }
          else {
            if(!mapInstance.current) return;
            marker = new kakao.maps.Marker({                          // 마커 생성 (한 번만 실행)
              position: latLng,
              image: defaultImg,
              map: mapInstance.current
            });
            markersRef.current[car.vehicleNumber] = marker;

            const overlay = new kakao.maps.CustomOverlay({            // 오버레이 생성 (한 번만 실행)
              content: `
                <div class="${styles["overlay-bubble"]}">
                  <div class="px-3 py-1 text-center flex flex-col items-center">
                    <div class="font-bold">${car.vehicleNumber}</div>
                    <div class="font-bold my-1">${car.type}</div>
                    <div class="${bgColor} ${textColor} w-15 p-1 font-bold rounded-sm text-center">
                      ${statusName}
                    </div>
                  </div>
                </div>`,
              position: latLng,
              xAnchor: 0.55,    
              yAnchor: 1.5,
              zIndex: 99
            });

            overlayRef.current[car.vehicleNumber] = overlay;

            // if(selectedCar?.vehicleNumber === p.vehicleNumber) {
            //   marker.setImage(hoverImg);
            //   overlay.setMap(mapInstance.current);
            //   activeOverlayRef.current = overlay;
            //   activeMarkerRef.current = marker;
            //   activeMarkerImgRef.current = defaultImg;
            //   selectedMarkerNumRef.current = p.vehicleNumber;
            // }

            const setOverlay = () => {
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
              if(activeOverlayRef.current === overlay) {    // active된 게 자기 자신
                overlay.setMap(null);
                activeOverlayRef.current = null;
                activeMarkerRef.current = null;
                activeMarkerImgRef.current = null;
              }
              else {    // active된 것이 다른 마커
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
                setSelectedCar(car);
                setCarListPage(true);
              }
            }
            kakao.maps.event.addListener(marker, "mouseover", setOverlay);
            // offHandlers.push(() => kakao.maps.event.removeListener(marker, "mouseover", setOverlay));   

            kakao.maps.event.addListener(marker, "mouseout", deleteOverlay);
            // offHandlers.push(() => kakao.maps.event.removeListener(marker, "mouseout", deleteOverlay));

            kakao.maps.event.addListener(marker, "click", controlClickOverlay);
            // offHandlers.push(() => kakao.maps.event.removeListener(marker, "click", controlClickOverlay));
          }
          createdMarkers.push(marker);
        })
      return createdMarkers;
    }

    // database에서 삭제된 차량들 찾아서 없애기
    Object.keys(markersRef.current).forEach(key => {
      if(!currentCars.includes(key)) {
        markersRef.current[key].setMap(null);
        overlayRef.current[key].setMap(null);
        delete markersRef.current[key];
        delete overlayRef.current[key];
      }
    })

    if (carStatusOption === "전체") {
        totalClustererRef.current?.addMarkers(makeMarkers());
    }
    else{
      if(!runningClustererRef.current || !notRunningClustererRef.current || 
          !inspectedClustererRef.current) return;

      const mapRef: Record<string, {clusterRef: kakao.maps.MarkerClusterer, optionName: string}> = {
        "ACTIVE": {
          clusterRef: runningClustererRef.current,
          optionName: "ACTIVE"
        },
        "INACTIVE": {
          clusterRef: notRunningClustererRef.current,
          optionName: "INACTIVE"
        },
        "INSPECTING": {
          clusterRef: inspectedClustererRef.current,
          optionName: "INSPECTING"
        }
      }
      const mapRefClusterRef = mapRef[carStatusOption].clusterRef;
      const mapRefOptionName = mapRef[carStatusOption].optionName;

      mapRefClusterRef.addMarkers(makeMarkers(mapRefOptionName));
    }
    
    // useEffect가 다시 실행되기 이전에, 컴포넌트 unmount될 때 cleanup 실행됨.
    // return () => {
      // offHandlers.forEach(removeFunc => removeFunc());
      // Object.values(markersRef.current).forEach(marker => marker.setMap(null));
      // Object.values(overlayRef.current).forEach(overlay => overlay.setMap(null));
      // markersRef.current = {};
      // overlayRef.current = {};
    // }
  }, [allCarLocations, visibleCarLocations, selectedCar]);

  return (
    <div ref={mapContainerRef} style={{ width: '100%', height: '100%'}}/>
  );
};

export default MapLocationSearch;