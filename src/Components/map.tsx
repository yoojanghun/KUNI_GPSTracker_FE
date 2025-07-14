import { useState, useEffect, useRef } from 'react';
import { useKakaoLoader } from 'react-kakao-maps-sdk';

type Position = { lat: number; lng: number; status: string };

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

  // 차량의 현재 위치 (예시 데이터)
  useEffect(() => {
    setPositions([
      { lat: 37.5665, lng: 126.9780, status: "운행중" },
      { lat: 37.5666, lng: 126.9781, status: "운행중" },
      { lat: 37.5670, lng: 126.9785, status: "미운행" },
      { lat: 37.5700, lng: 126.9800, status: "점검중" },
      { lat: 37.5720, lng: 126.9820, status: "점검중" },
      
      { lat: 37.27943075229118, lng: 127.01763998406159, status: "운행중" },
      { lat: 37.55915668706214, lng: 126.92536526611102, status: "미운행" },
      { lat: 35.13854258261161, lng: 129.1014781294671, status: "운행중" },
      { lat: 37.55518388656961, lng: 126.92926237742505, status: "점검중" },
      { lat: 35.20618517638034, lng: 129.07944301057026, status: "미운행" },

      { lat: 37.561110808242056, lng: 126.9831268386891, status: "점검중" },
      { lat: 37.86187129655063, lng: 127.7410250820423, status: "미운행" },
      { lat: 37.47160156778542, lng: 126.62818064142286, status: "운행중" },
      { lat: 35.10233410927457, lng: 129.02611815856181, status: "점검중" },
      { lat: 35.10215562270429, lng: 129.02579793018205, status: "운행중" },
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

    const createMarkers = (status: string, imageUrl: string) =>
        positions
          .filter(p => p.status === status)
          .map(p => new kakao.maps.Marker({
            position: new kakao.maps.LatLng(p.lat, p.lng),
            image: new kakao.maps.MarkerImage(
              imageUrl,
              new kakao.maps.Size(40, 40),
              { offset: new kakao.maps.Point(20, 40) }
            )
    }));

    runningClustererRef.current?.addMarkers(createMarkers('운행중', '/running.png'));
    notRunningClustererRef.current?.addMarkers(createMarkers('미운행', '/not-running.png'));
    inspectedClustererRef.current?.addMarkers(createMarkers('점검중', '/inspected.png'));
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