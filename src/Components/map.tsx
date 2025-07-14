import { useState, useEffect, useRef } from 'react';
import { useKakaoLoader } from 'react-kakao-maps-sdk';

type PathPoint = {
  lat: number;
  lng: number;
  time: number;
};

type Position = {
  number: string;
  status: string;
  path: PathPoint[];
};

type MapTestProps = {
  flexSize?: number;
  level?: number;
}

const MapTest: React.FC<MapTestProps> = ({ flexSize, level = 13 }) => {
  const [positions, setPositions] = useState<Position[]>([]);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<kakao.maps.Map | null>(null);

  const runningClustererRef    = useRef<kakao.maps.MarkerClusterer | null>(null);
  const notRunningClustererRef = useRef<kakao.maps.MarkerClusterer | null>(null);
  const inspectedClustererRef  = useRef<kakao.maps.MarkerClusterer | null>(null);

  const polylinesRef = useRef<kakao.maps.Polyline[]>([]);

  // 차량의 현재 위치 (예시 데이터)
  useEffect(() => {
    setPositions([
      { number: "18라8150", 
        status: "운행중", 
        path: [
                { lat: 37.5665, lng: 126.9780, time: 1710518400000 },
                { lat: 37.5665, lng: 126.9775, time: 1710518460000 },
                { lat: 37.5660, lng: 126.9775, time: 1710518520000 },
                { lat: 37.5660, lng: 126.9780, time: 1710518580000 },
                { lat: 37.5655, lng: 126.9780, time: 1710518640000 },
                { lat: 37.5655, lng: 126.9785, time: 1710518700000 },
                { lat: 37.5660, lng: 126.9785, time: 1710518760000 },
              ]
      },
      { number: "15라8495", 
        status: "운행중", 
        path: [
                { lat: 37.5766, lng: 126.9781, time: 1710518400000 },
                { lat: 37.5766, lng: 126.9776, time: 1710518460000 },
                { lat: 37.5771, lng: 126.9776, time: 1710518520000 },
                { lat: 37.5771, lng: 126.9781, time: 1710518580000 },
                { lat: 37.5776, lng: 126.9781, time: 1710518640000 },
                { lat: 37.5776, lng: 126.9776, time: 1710518700000 },
                { lat: 37.5781, lng: 126.9776, time: 1710518760000 },
              ] 
      },
      { number: "84나5842", 
        status: "미운행", 
        path: [
                { lat: 37.5670, lng: 126.9785, time: 1710518400000 },
                { lat: 37.5670, lng: 126.9780, time: 1710518460000 },
                { lat: 37.5665, lng: 126.9780, time: 1710518520000 },
                { lat: 37.5665, lng: 126.9775, time: 1710518580000 },
                { lat: 37.5670, lng: 126.9775, time: 1710518640000 },
                { lat: 37.5670, lng: 126.9780, time: 1710518700000 },
                { lat: 37.5675, lng: 126.9780, time: 1710518760000 },
              ] 
      },
      { number: "14라3098", 
        status: "점검중", 
        path: [
                { lat: 37.5700, lng: 126.9800, time: 1710518400000 },
                { lat: 37.5705, lng: 126.9804, time: 1710518460000 },
                { lat: 37.5710, lng: 126.9808, time: 1710518520000 },
                { lat: 37.5715, lng: 126.9812, time: 1710518580000 },
                { lat: 37.5720, lng: 126.9816, time: 1710518640000 },
                { lat: 37.5725, lng: 126.9820, time: 1710518700000 },
                { lat: 37.5730, lng: 126.9824, time: 1710518760000 },
              ] 
      },
      { number: "25차9269", 
        status: "점검중", 
        path: [
                { lat: 37.5720, lng: 126.9820, time: 1710518400000 },
                { lat: 37.5723, lng: 126.9825, time: 1710518460000 },
                { lat: 37.5726, lng: 126.9830, time: 1710518520000 },
                { lat: 37.5729, lng: 126.9835, time: 1710518580000 },
                { lat: 37.5732, lng: 126.9840, time: 1710518640000 },
                { lat: 37.5735, lng: 126.9845, time: 1710518700000 },
                { lat: 37.5738, lng: 126.9850, time: 1710518760000 },
              ] 
      },
      
      { number: "12아8406", 
        status: "운행중", 
        path: [
                { lat: 37.2794, lng: 127.0176, time: 1710518400000 },
                { lat: 37.2797, lng: 127.0181, time: 1710518460000 },
                { lat: 37.2800, lng: 127.0186, time: 1710518520000 },
                { lat: 37.2803, lng: 127.0191, time: 1710518580000 },
                { lat: 37.2806, lng: 127.0196, time: 1710518640000 },
                { lat: 37.2809, lng: 127.0201, time: 1710518700000 },
                { lat: 37.2812, lng: 127.0206, time: 1710518760000 },
              ] 
      },
      { number: "94사0914", 
        status: "미운행", 
        path: [
                { lat: 37.5591, lng: 126.9253, time: 1710518400000 },
                { lat: 37.5596, lng: 126.9257, time: 1710518460000 },
                { lat: 37.5601, lng: 126.9261, time: 1710518520000 },
                { lat: 37.5606, lng: 126.9265, time: 1710518580000 },
                { lat: 37.5611, lng: 126.9269, time: 1710518640000 },
                { lat: 37.5616, lng: 126.9273, time: 1710518700000 },
                { lat: 37.5621, lng: 126.9277, time: 1710518760000 },
              ] 
      },
      { number: "28차3188", 
        status: "운행중", 
        path: [
                { lat: 35.1385, lng: 129.1014, time: 1710518400000 },
                { lat: 35.1389, lng: 129.1019, time: 1710518460000 },
                { lat: 35.1393, lng: 129.1024, time: 1710518520000 },
                { lat: 35.1397, lng: 129.1029, time: 1710518580000 },
                { lat: 35.1401, lng: 129.1034, time: 1710518640000 },
                { lat: 35.1405, lng: 129.1039, time: 1710518700000 },
                { lat: 35.1409, lng: 129.1044, time: 1710518760000 },
              ] 
      },
      { number: "76자7220", 
        status: "점검중", 
        path: [
                { lat: 37.5551, lng: 126.9292, time: 1710518400000 },
                { lat: 37.5551, lng: 126.9287, time: 1710518460000 },
                { lat: 37.5546, lng: 126.9287, time: 1710518520000 },
                { lat: 37.5546, lng: 126.9292, time: 1710518580000 },
                { lat: 37.5551, lng: 126.9292, time: 1710518640000 },
                { lat: 37.5551, lng: 126.9297, time: 1710518700000 },
                { lat: 37.5556, lng: 126.9297, time: 1710518760000 }
              ] 
      },
      { number: "97사8406", 
        status: "미운행", 
        path: [
                { lat: 35.2061, lng: 129.0794, time: 1710518400000 },
                { lat: 35.2065, lng: 129.0799, time: 1710518460000 },
                { lat: 35.2070, lng: 129.0804, time: 1710518520000 },
                { lat: 35.2075, lng: 129.0809, time: 1710518580000 },
                { lat: 35.2080, lng: 129.0814, time: 1710518640000 },
                { lat: 35.2085, lng: 129.0819, time: 1710518700000 },
                { lat: 35.2090, lng: 129.0824, time: 1710518760000 },
              ] 
      },

      { number: "71라0899", 
        status: "점검중", 
        path: [
                { lat: 37.5611, lng: 126.9831, time: 1710518400000 },
                { lat: 37.5616, lng: 126.9836, time: 1710518460000 },
                { lat: 37.5621, lng: 126.9841, time: 1710518520000 },
                { lat: 37.5626, lng: 126.9846, time: 1710518580000 },
                { lat: 37.5631, lng: 126.9851, time: 1710518640000 },
                { lat: 37.5636, lng: 126.9856, time: 1710518700000 },
                { lat: 37.5641, lng: 126.9861, time: 1710518760000 },
              ] 
      },
      { number: "55바9753", 
        status: "미운행", 
        path: [
                { lat: 37.8618, lng: 127.7410, time: 1710518400000 },
                { lat: 37.8622, lng: 127.7415, time: 1710518460000 },
                { lat: 37.8626, lng: 127.7420, time: 1710518520000 },
                { lat: 37.8630, lng: 127.7425, time: 1710518580000 },
                { lat: 37.8634, lng: 127.7430, time: 1710518640000 },
                { lat: 37.8638, lng: 127.7435, time: 1710518700000 },
                { lat: 37.8642, lng: 127.7440, time: 1710518760000 },
              ] 
      },
      { number: "33아3521", 
        status: "운행중", 
        path: [
                { lat: 37.4716, lng: 126.6281, time: 1710518400000 },
                { lat: 37.4720, lng: 126.6286, time: 1710518460000 },
                { lat: 37.4724, lng: 126.6291, time: 1710518520000 },
                { lat: 37.4728, lng: 126.6296, time: 1710518580000 },
                { lat: 37.4732, lng: 126.6301, time: 1710518640000 },
                { lat: 37.4736, lng: 126.6306, time: 1710518700000 },
                { lat: 37.4740, lng: 126.6311, time: 1710518760000 },
              ] 
      },
      { number: "63라2469", 
        status: "점검중", 
        path: [
                { lat: 35.1023, lng: 129.0261, time: 1710518400000 },
                { lat: 35.1027, lng: 129.0265, time: 1710518460000 },
                { lat: 35.1031, lng: 129.0270, time: 1710518520000 },
                { lat: 35.1035, lng: 129.0275, time: 1710518580000 },
                { lat: 35.1039, lng: 129.0280, time: 1710518640000 },
                { lat: 35.1043, lng: 129.0285, time: 1710518700000 },
                { lat: 35.1047, lng: 129.0290, time: 1710518760000 },
              ] 
      },
      { number: "24하5949", 
        status: "운행중", 
        path: [
                { lat: 35.1021, lng: 129.0257, time: 1710518400000 },
                { lat: 35.1021, lng: 129.0252, time: 1710518460000 },
                { lat: 35.1016, lng: 129.0252, time: 1710518520000 },
                { lat: 35.1016, lng: 129.0247, time: 1710518580000 },
                { lat: 35.1011, lng: 129.0247, time: 1710518640000 },
                { lat: 35.1011, lng: 129.0252, time: 1710518700000 },
                { lat: 35.1006, lng: 129.0252, time: 1710518760000 }
              ] 
      },
    ]);
  }, []);

  useEffect(() => {
    // loading이 끝나고 에러가 없으며, ref가 유효할 때만 실행
    if (!mapContainerRef.current || mapInstance.current) return;

    const kakao = (window as any).kakao as typeof window.kakao;

    // 지도 생성
    mapInstance.current = new kakao.maps.Map(mapContainerRef.current, {
      center: new kakao.maps.LatLng(37.5665, 126.9780),
      level: level,
    });

    // 운행중 차량 클러스터러 생성
    runningClustererRef.current = new kakao.maps.MarkerClusterer({
      map: mapInstance.current,
      averageCenter: true,
      minLevel: 8,
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
      minLevel: 8,
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

    // 점검중 차량 클러스터러 생성
    inspectedClustererRef.current = new kakao.maps.MarkerClusterer({
      map: mapInstance.current,
      averageCenter: true,
      minLevel: 8,
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
      mapInstance.current!.setCenter(
        new kakao.maps.LatLng(37.5665, 126.9780)
      );
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      mapInstance.current = null;
      runningClustererRef.current = null;
      notRunningClustererRef.current = null;
      inspectedClustererRef.current = null;
    };
  }, [level]);

  useEffect(() => {
    if (!mapInstance.current) return;
    const kakao = (window as any).kakao;

      // 이전 마커 클리어
    runningClustererRef.current?.clear();
    notRunningClustererRef.current?.clear();
    inspectedClustererRef.current?.clear();

    // 이전 폴리라인 제거
    polylinesRef.current.forEach(polyline => polyline.setMap(null));
    polylinesRef.current = [];

    const createMarkers = (status: string, imageUrl: string) =>
      positions
        .filter(p => p.status === status)
        .map(p => {
          const lastPoint = p.path[p.path.length - 1]; // 마지막 위치
          return new kakao.maps.Marker({
            position: new kakao.maps.LatLng(lastPoint.lat, lastPoint.lng),
            image: new kakao.maps.MarkerImage(
              imageUrl,
              new kakao.maps.Size(40, 40),
              { offset: new kakao.maps.Point(20, 40) }
            )
          });
    });

    runningClustererRef.current?.addMarkers(createMarkers('운행중', '/running.png'));
    notRunningClustererRef.current?.addMarkers(createMarkers('미운행', '/not-running.png'));
    inspectedClustererRef.current?.addMarkers(createMarkers('점검중', '/inspected.png'));

    // 차량별 경로 폴리라인 생성
    positions.forEach(vehicle => {
      const linePath = vehicle.path.map(point =>
        new kakao.maps.LatLng(point.lat, point.lng)
      );

      const polyline = new kakao.maps.Polyline({
        path: linePath,
        strokeWeight: 4,
        strokeColor: "#3399FF",
        strokeOpacity: 0.8,
        strokeStyle: "solid",
      });

      polyline.setMap(mapInstance.current);
      polylinesRef.current.push(polyline);
    });
  }, [positions]);


  return (
    <div
      ref={mapContainerRef}
      style={{
        flex: flexSize,
        width: '100%',   
        height: '100%', 
        minWidth: 0,     
      }}
    />
  );
};

export default MapTest;