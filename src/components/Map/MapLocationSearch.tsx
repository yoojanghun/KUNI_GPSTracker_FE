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
  const prevMarkerImgRef = useRef<kakao.maps.MarkerImage | null>(null);

  const markersRef = useRef<Record<string, kakao.maps.Marker>>({});
  const overlayRef = useRef<Record<string, kakao.maps.CustomOverlay>>({});

  const intervalCtrl = useRef<ReturnType<typeof prcInterval> | null> (null);
  const stepRef = useRef<number>(0);
  const isBusy = useRef<boolean>(false);
  const allCarsRef = useRef<CarInfo[]>([]);
  const targetedCars = useRef<string[]>([]);

  // 마커의 최신 상태, useMemo의 최신 오버레이 스타일 저장
  const markerStyleRef = useRef<Record<string, CustomOverlayStyle>>({});

  const removeHandlers = useRef<Record<string, Array<() => void>>>({});

  // 아래 코드에서 그냥 allCarsRef.current대신 allCarLocations로 쓰면 최신 allCarLocations를 
  // 반영하지 못할 수 있다. 따라서 useRef로 관리.
  useEffect(() => {
    allCarsRef.current = allCarLocations;
  }, [allCarLocations]);

  useEffect(() => {
    const firstFetch = async () => {
      isBusy.current = true;
      try {
        await allCarsPolling();
        stepRef.current += 1;
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
      if(!mapInstance.current) return;
      if(isBusy.current) return;
      isBusy.current = true;      // true => 나 지금 바쁘다
      try {
        if(!mapInstance.current) return;
        if(stepRef.current === 0) {
          await allCarsPolling();
          stepRef.current += 1;
        }
        else if(stepRef.current > 0 && stepRef.current < 4) {
          if(mapInstance.current.getLevel() <= 8) {
            await visibleCarsPolling(targetedCars.current);
          }
          stepRef.current += 1;
          if(stepRef.current === 4) {
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

    return () => {
      intervalCtrl.current?.cancel();
    };
  }, []);

  // markerMap 만든 후, status에 따라 디자인 가져올 수 있도록
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

    // 지도의 4개의 꼭짓점 gps 추적 후 저장
    // 지도안 들어있는 마커 추적 후 targetedCars.current에 저장
    const mapCornerGpsSearch = () => {
      if(!mapInstance.current) return;
      if(mapInstance.current.getLevel() > 8) return;
      const bounds = mapInstance.current.getBounds();
      const southWest = bounds.getSouthWest();
      const northEast = bounds.getNorthEast();
      const minLat = southWest.getLat();
      const minLng = southWest.getLng();
      const maxLat = northEast.getLat();
      const maxLng = northEast.getLng();
      targetedCars.current = allCarsRef.current
        .filter(
          carObj => 
            carObj.latitude >= minLat && 
            carObj.latitude <= maxLat && 
            carObj.longitude >= minLng && 
            carObj.longitude <= maxLng)
        .map(carObj => carObj.vehicleNumber);
    }
    kakao.maps.event.addListener(mapInstance.current, "idle", mapCornerGpsSearch);

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

    const hideActiveOverlay = () => {
      if (activeOverlayRef.current) {
        activeOverlayRef.current.setMap(null);
      }
    };

    // 맵 모션이 끝났을 때(zoom_changed/idle) 마커 위치로 즉시 재정렬 후 다시 표시
    const resyncActiveOverlay = () => {
      if (!mapInstance.current || !activeMarkerRef.current || !activeOverlayRef.current) return;

      // 마커 현재 좌표로 오버레이 위치 맞추고 다시 표시
      const pos = activeMarkerRef.current.getPosition();
      activeOverlayRef.current.setPosition(pos);
      activeOverlayRef.current.setMap(mapInstance.current);
    };

    // 줌/드래그 시작~진행 중에는 숨기고, 끝나면 재정렬
    kakao.maps.event.addListener(mapInstance.current, "dragstart", hideActiveOverlay);
    kakao.maps.event.addListener(mapInstance.current, "center_changed", hideActiveOverlay);
    kakao.maps.event.addListener(mapInstance.current, "zoom_changed", resyncActiveOverlay);
    kakao.maps.event.addListener(mapInstance.current, "idle", resyncActiveOverlay);

    // zoom 컨트롤러 생성
    const zoomControl = new kakao.maps.ZoomControl();
    mapInstance.current.addControl(zoomControl, kakao.maps.ControlPosition.BOTTOMLEFT);
    zoomControlRef.current = zoomControl;

    return () => {
      if(!mapInstance.current || !zoomControlRef.current) return;
      kakao.maps.event.removeListener(mapInstance.current, 'idle', mapCenterLevelEvent);
      kakao.maps.event.removeListener(mapInstance.current, "idle", mapCornerGpsSearch);
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

  useEffect(() => {
    if(!mapInstance.current) return;
    const removeOverlayMap = () => {
      if(activeMarkerRef.current && activeOverlayRef.current && prevMarkerImgRef.current) {
        activeOverlayRef.current.setMap(null);
        activeOverlayRef.current = null;
        activeMarkerRef.current.setImage(prevMarkerImgRef.current);
        activeMarkerRef.current = null;
        prevMarkerImgRef.current = null;
        setSelectedCar(null);
      }
    };
    kakao.maps.event.addListener(mapInstance.current, "click", removeOverlayMap);

    return () => {
      if(!mapInstance.current) return;
      kakao.maps.event.removeListener(mapInstance.current, "click", removeOverlayMap);
    }
  }, [])

  useEffect(() => {
    const currentCars = allCarLocations.map(car => car.vehicleNumber);

    totalClustererRef.current?.clear();
    runningClustererRef.current?.clear();
    notRunningClustererRef.current?.clear();
    inspectedClustererRef.current?.clear();

    const setMarkers = (status?: string) => {
      let createdMarkers: kakao.maps.Marker[] = [];
      allCarLocations
        .filter(car => car.status === status || !status)
        .forEach(car => {
          const marker = markersRef.current[car.vehicleNumber];
          if(!marker) {
            if(!mapInstance.current) return;
            const latLng = new kakao.maps.LatLng(car.latitude, car.longitude);
            const {
              defaultMarkerImg: defaultImg,
              bgColor,
              textColor,
              statusName
            } = markerMap[car.status];
            markerStyleRef.current[car.vehicleNumber] = markerMap[car.status];    // 처음 status와 나중 status가 달라졌을 때를 대비

            const newMarker = new kakao.maps.Marker({            // 마커 생성 (한 번만 실행)
              position: latLng,
              image: defaultImg,
              map: mapInstance.current
            });
            markersRef.current[car.vehicleNumber] = newMarker;

            const newOverlay = new kakao.maps.CustomOverlay({
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
            })
            overlayRef.current[car.vehicleNumber] = newOverlay;

            const setOverlay = () => {
              const style = markerStyleRef.current[car.vehicleNumber] ?? markerMap[car.status];
              newMarker.setImage(style.hoverMarkerImg);
              newOverlay.setMap(mapInstance.current);
            };
            const deleteOverlay = () => {
              const style = markerStyleRef.current[car.vehicleNumber] ?? markerMap[car.status];
              if(activeMarkerRef.current !== newMarker) {             // active된 marker가 아니라면 overlay 닫고, marker기본 이미지
                newMarker.setImage(style.defaultMarkerImg);
                newOverlay.setMap(null);
              }
            };
            const controlClickOverlay = () => {
              const style = markerStyleRef.current[car.vehicleNumber] ?? markerMap[car.status];
              if(activeMarkerRef.current && activeMarkerRef.current === newMarker) {
                newMarker.setImage(style.defaultMarkerImg);
                newOverlay.setMap(null);
                activeMarkerRef.current = null;
                activeOverlayRef.current = null;
                prevMarkerImgRef.current = null;
                setSelectedCar(null);
              }
              else {
                if(activeMarkerRef.current && prevMarkerImgRef.current) {
                  activeMarkerRef.current.setImage(prevMarkerImgRef.current);
                }
                if(activeOverlayRef.current) {
                  activeOverlayRef.current.setMap(null);
                }
                newMarker.setImage(style.hoverMarkerImg);
                newOverlay.setMap(mapInstance.current);
                activeMarkerRef.current = newMarker;
                activeOverlayRef.current = newOverlay;
                prevMarkerImgRef.current = style.defaultMarkerImg;
                setSelectedCar(car);
                setCarListPage(true);
              }
            };
            kakao.maps.event.addListener(newMarker, "mouseover", setOverlay);
            kakao.maps.event.addListener(newMarker, "mouseout", deleteOverlay);
            kakao.maps.event.addListener(newMarker, "click", controlClickOverlay);

            removeHandlers.current[car.vehicleNumber] = [
              () => kakao.maps.event.removeListener(newMarker, "mouseover", setOverlay),
              () => kakao.maps.event.removeListener(newMarker, "mouseout", deleteOverlay),
              () => kakao.maps.event.removeListener(newMarker, "click", controlClickOverlay)
            ]
          }
          createdMarkers.push(markersRef.current[car.vehicleNumber]); 
        })
      
      Object.keys(markersRef.current).forEach(carNum => {
        if(!currentCars.includes(carNum)) {
          markersRef.current[carNum].setMap(null);
          delete markersRef.current[carNum];
          overlayRef.current[carNum].setMap(null);
          delete overlayRef.current[carNum];
          delete markerStyleRef.current[carNum];
          removeHandlers.current[carNum].forEach(fn => fn());
          delete removeHandlers.current[carNum];
        }
      })
      return createdMarkers;
    }

    if(carStatusOption === "전체") {
      totalClustererRef.current?.addMarkers(setMarkers());
    } else {
      const clusterMap = {
        "ACTIVE": runningClustererRef.current,
        "INACTIVE": notRunningClustererRef.current,
        "INSPECTING": inspectedClustererRef.current
      }
      clusterMap[carStatusOption]?.addMarkers(setMarkers(carStatusOption));
    }

  }, [allCarLocations, carStatusOption])

  useEffect(() => {
    allCarLocations
      .forEach((car) => {
        const marker = markersRef.current[car.vehicleNumber];
        if(!marker) return; 
        const overlay = overlayRef.current[car.vehicleNumber];

        const latLng = new kakao.maps.LatLng(car.latitude, car.longitude);
        marker.setPosition(latLng);
        overlay.setPosition(latLng);

        const prevStyle = markerStyleRef.current[car.vehicleNumber];
        if(prevStyle.statusName !== car.status) {
          markerStyleRef.current[car.vehicleNumber] = markerMap[car.status];
          const {
            defaultMarkerImg,
            hoverMarkerImg,
            bgColor,
            textColor,
            statusName
          } = markerStyleRef.current[car.vehicleNumber];

          overlay.setContent(`
            <div class="${styles["overlay-bubble"]}">
              <div class="px-3 py-1 text-center flex flex-col items-center">
                <div class="font-bold">${car.vehicleNumber}</div>
                <div class="font-bold my-1">${car.type}</div>
                <div class="${bgColor} ${textColor} w-15 p-1 font-bold rounded-sm text-center">
                  ${statusName}
                </div>
              </div>
            </div>`
          );

          if(activeMarkerRef.current === marker) {
            marker.setImage(hoverMarkerImg);
            prevMarkerImgRef.current = defaultMarkerImg;
          }
          else {
            marker.setImage(defaultMarkerImg);
          }
        }
      })
  }, [allCarLocations])

  useEffect(() => {
    visibleCarLocations
      .forEach(car => {
        const marker = markersRef.current[car.vehicleNumber];
        if(!marker) return;
        const overlay = overlayRef.current[car.vehicleNumber];

        const latLng = new kakao.maps.LatLng(car.latitude, car.longitude);
        marker.setPosition(latLng);
        overlay.setPosition(latLng);

        const prevStyle = markerStyleRef.current[car.vehicleNumber];
        if(prevStyle.statusName !== car.status) {
          markerStyleRef.current[car.vehicleNumber] = markerMap[car.status];
          const {
            defaultMarkerImg,
            hoverMarkerImg,
            bgColor,
            textColor,
            statusName
          } = markerStyleRef.current[car.vehicleNumber];

          overlay.setContent(`
            <div class="${styles["overlay-bubble"]}">
              <div class="px-3 py-1 text-center flex flex-col items-center">
                <div class="font-bold">${car.vehicleNumber}</div>
                <div class="font-bold my-1">${car.type}</div>
                <div class="${bgColor} ${textColor} w-15 p-1 font-bold rounded-sm text-center">
                  ${statusName}
                </div>
              </div>
            </div>`
          );

          if(activeMarkerRef.current === marker) {
            marker.setImage(hoverMarkerImg);
            prevMarkerImgRef.current = defaultMarkerImg;
          }
          else {
            marker.setImage(defaultMarkerImg);
          }
        }
      })
  }, [visibleCarLocations])

  useEffect(() => {
    if(!selectedCar?.vehicleNumber) return;
    if(activeMarkerRef.current && prevMarkerImgRef.current) {
      activeMarkerRef.current.setImage(prevMarkerImgRef.current);
    }
    if(activeOverlayRef.current) {
      activeOverlayRef.current.setMap(null);
    }
    activeMarkerRef.current = null;
    prevMarkerImgRef.current = null;

    const selectedMarker = markersRef.current[selectedCar.vehicleNumber];
    const selectedMarkerOverlay = overlayRef.current[selectedCar.vehicleNumber];

    const style = markerStyleRef.current[selectedCar.vehicleNumber] ?? markerMap[selectedCar.status];

    if(selectedMarker && selectedMarkerOverlay) {
      selectedMarkerOverlay.setMap(mapInstance.current);
      selectedMarker.setImage(style.hoverMarkerImg);
      activeMarkerRef.current = selectedMarker;
      activeOverlayRef.current = selectedMarkerOverlay;   
      prevMarkerImgRef.current = style.defaultMarkerImg;
    }
  }, [selectedCar])

  return (
    <div ref={mapContainerRef} style={{ width: '100%', height: '100%'}}/>
  );
};

export default MapLocationSearch;