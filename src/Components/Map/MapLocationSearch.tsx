import { useEffect, useRef, useMemo } from 'react';
import { 
  useCarListPageStore, 
  useCarStatusOptionStore, 
  useLocationSearchMapStore, 
  useSelectCarStore, 
  useSelectedCarLatLng, 
  useTrackCarStore,
  useMapCarLocationStore
} from '@/Store/carStatus';
import styles from "./MapCustomOverlay.module.css";
import {} from 'react-kakao-maps-sdk';

type MapTestProps = {
  maxLevel: number;
}

type CustomOverlayStyle = {
  defaultMarkerImg: kakao.maps.MarkerImage, 
  hoverMarkerImg: kakao.maps.MarkerImage,
  bgColor: string,
  textColor: string,
}

function MapLocationSearch ({ maxLevel }: MapTestProps) {

  const { selectedCar, setSelectedCar } = useSelectCarStore();
  const setCarListPage = useCarListPageStore(state => state.setCarListPage);
  const carStatusOption = useCarStatusOptionStore(state => state.carStatusOption);
  const { 
    locationSearchMapCenter, 
    setLocationSearchMapCenter, 
    locationSearchMapLevel, 
    setLocationSearchMapLevel
  } = useLocationSearchMapStore();
  const { mapCenterCarList, mapLevelCarList } = useTrackCarStore();
  const selectedCarLatLng = useSelectedCarLatLng(state => state.latLng);
  const selectedCarNumber = useSelectedCarLatLng(state => state.carNumber);

  // const [positions, setPositions] = useState<CarWithPath[]>([]);      // positions에는 차량들의 리스트 객체들이 들어감

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

  const startPolling = useMapCarLocationStore(state => state.startPolling);
  const carLocations = useMapCarLocationStore(state => state.carLocations);

  // 실제로는 zustand에서 정의한 useMapCarLocationStore의 
  // startPolling으로 위도, 경도, 상태중 하나 이상이 변한 값들만 가져옴.
  // 또한 파라미터를 하나 더 추가해서 그게 false이면, 프로그램에서 삭제된 차량 => 마커 완전히 제거
  useEffect(() => {
    startPolling();
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
      textColor: "text-[#5491f5]"
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
      textColor: "text-[#e94b3e]"
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
      textColor: "text-[#ffa62a]"
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

  // 마커와 클러스터링 생성, 만들어진 마커로 지도 클러스터링
  useEffect(() => {
    // const currentCars = positions.map(p => p.vehicleNumber);

    totalClustererRef.current?.clear();
    runningClustererRef.current?.clear();
    notRunningClustererRef.current?.clear();
    inspectedClustererRef.current?.clear();
    
    activeOverlayRef.current?.setMap(null);
    activeMarkerRef.current = null;
    activeMarkerImgRef.current = null;
    
    const offHandlers: Array<() => void> = [];

    const makeMarkers = (status?: string) => {
      const createdMarkers: kakao.maps.Marker[] = [];
      carLocations
        .filter(p => p.status === status || !status)
        .forEach(p => {
          const latLng = new kakao.maps.LatLng(p.latitude, p.longitude);
          const {
            defaultMarkerImg: defaultImg,
            hoverMarkerImg: hoverImg,
            bgColor,
            textColor
          } = markerMap[p.status];

          let marker = markersRef.current[p.vehicleNumber];        

          // 아래는 marker가 존재하면 setPosition이다. 
          // 그런데 이를 "마커의 상태, gps가 변하면" 으로 수정 
          if(marker) {                                            // 지도에 표시된 차량이 이미 존재
            marker.setPosition(latLng);
            marker.setImage(defaultImg);
            if(overlayRef.current[p.vehicleNumber]) {
              overlayRef.current[p.vehicleNumber].setPosition(latLng);
            }
          }
          else {
            if(!mapInstance.current) return;
            marker = new kakao.maps.Marker({                          // 마커 생성 (한 번만 실행)
              position: latLng,
              image: defaultImg,
              map: mapInstance.current
            });
            markersRef.current[p.vehicleNumber] = marker;

            const overlay = new kakao.maps.CustomOverlay({            // 오버레이 생성 (한 번만 실행)
              content: `
                <div class="${styles["overlay-bubble"]}">
                  <div class="px-3 py-1 text-center">
                    <div class="font-bold">${p.vehicleNumber}</div>
                    <div class="font-bold my-1">${p.type}</div>
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

            overlayRef.current[p.vehicleNumber] = overlay;

            if(selectedCar?.vehicleNumber === p.vehicleNumber) {
              marker.setImage(hoverImg);
              overlay.setMap(mapInstance.current);
              activeOverlayRef.current = overlay;
              activeMarkerRef.current = marker;
              activeMarkerImgRef.current = defaultImg;
            }

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
                setCarListPage(true);
              }
            }
            kakao.maps.event.addListener(marker, "mouseover", setOverlay);
            offHandlers.push(() => kakao.maps.event.removeListener(marker, "mouseover", setOverlay));   

            kakao.maps.event.addListener(marker, "mouseout", deleteOverlay);
            offHandlers.push(() => kakao.maps.event.removeListener(marker, "mouseout", deleteOverlay));

            kakao.maps.event.addListener(marker, "click", controlClickOverlay);
            offHandlers.push(() => kakao.maps.event.removeListener(marker, "click", controlClickOverlay));
          }
          createdMarkers.push(marker);
        })
      return createdMarkers;
    }

    // 만약 api가 변경된 차량만 제공하게 되면 아래 코드는 필요 X
    // Object.keys(markersRef.current).forEach(key => {
    //   if(!currentCars.includes(key)) {
    //     markersRef.current[key].setMap(null);
    //     overlayRef.current[key].setMap(null);
    //     delete markersRef.current[key];
    //     delete overlayRef.current[key];
    //   }
    // })

    if (carStatusOption === "전체") {
        totalClustererRef.current?.addMarkers(makeMarkers());
    }
    else{
      if(!runningClustererRef.current || !notRunningClustererRef.current || 
          !inspectedClustererRef.current) return;

      const mapRef: Record<string, {clusterRef: kakao.maps.MarkerClusterer, optionName: string}> = {
        "운행중": {
          clusterRef: runningClustererRef.current,
          optionName: "ACTIVE"
        },
        "미운행": {
          clusterRef: notRunningClustererRef.current,
          optionName: "INACTIVE"
        },
        "점검중": {
          clusterRef: inspectedClustererRef.current,
          optionName: "INSPECTING"
        }
      }
      const mapRefClusterRef = mapRef[carStatusOption].clusterRef;
      const mapRefOptionName = mapRef[carStatusOption].optionName;

      mapRefClusterRef.addMarkers(makeMarkers(mapRefOptionName));
    }
    
    return () => {
      offHandlers.forEach(removeFunc => removeFunc());
      Object.values(markersRef.current).forEach(marker => marker.setMap(null));
      Object.values(overlayRef.current).forEach(overlay => overlay.setMap(null));
      markersRef.current = {};
      overlayRef.current = {};
    }
  }, [carStatusOption, carLocations, selectedCar]);

  useEffect(() => {
    const { latitude, longitude } = selectedCarLatLng;
    if (!selectedCarNumber || latitude == null || longitude == null) return;

    const marker = markersRef.current[selectedCarNumber];
    const overlay = overlayRef.current[selectedCarNumber];

    const newPos = new kakao.maps.LatLng(latitude, longitude);

    if (marker) marker.setPosition(newPos);
    if (overlay) overlay.setPosition(newPos);
  }, [selectedCarNumber, selectedCarLatLng]);

  return (
    <div ref={mapContainerRef} style={{ width: '100%', height: '100%'}}/>
  );
};

export default MapLocationSearch;