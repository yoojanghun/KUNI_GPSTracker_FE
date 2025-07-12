import { useState, useEffect, useRef } from 'react';
import { useKakaoLoader } from 'react-kakao-maps-sdk';

type Position = { lat: number; lng: number };

type MapTestProps = {
  flexSize?: number;
  level?: number;
}

const MapTest: React.FC<MapTestProps> = ({ flexSize, level = 13 }) => {
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, error] = useKakaoLoader({
    appkey: 'b871891974393c66ad7595d318e973a2',
  });

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<kakao.maps.Map | null>(null);

  useEffect(() => {
    setPositions([
      { lat: 37.5665, lng: 126.9780 },
      { lat: 37.5666, lng: 126.9781 },
      { lat: 37.5670, lng: 126.9785 },
      { lat: 37.5700, lng: 126.9800 },
      { lat: 37.5720, lng: 126.9820 },
    ]);
  }, []);

  useEffect(() => {
    // loading이 끝나고 에러가 없으며, ref가 유효할 때만 실행
    if (loading || error || !mapContainerRef.current) return;

    const kakao = (window as any).kakao as typeof window.kakao;

    // 지도 생성
    mapInstance.current = new kakao.maps.Map(mapContainerRef.current, {
      center: new kakao.maps.LatLng(37.5665, 126.9780),
      level: level,
    });

    // 클러스터러 생성
    const clusterer = new kakao.maps.MarkerClusterer({
      map: mapInstance.current,
      averageCenter: true,
      minLevel: 8,
    });

    // 마커 생성
    const markers = positions.map((pos) => new kakao.maps.Marker({
      position: new kakao.maps.LatLng(pos.lat, pos.lng),
      image: new kakao.maps.MarkerImage(
        '/vite.svg',
        new kakao.maps.Size(40, 40),
        { offset: new kakao.maps.Point(20, 40) }
      ),
    }));

    // 마커 클러스터러에 추가
    clusterer.addMarkers(markers);

    // 리사이즈 대응
    const handleResize = () => {
      if (!mapInstance.current) return;
      kakao.maps.event.trigger(mapInstance.current!, 'resize');
      mapInstance.current!.setCenter(
        new kakao.maps.LatLng(37.5665, 126.9780)
      );
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [loading, error, positions, level]);

  if (loading) return <div>Loading...</div>;
  if (error)   return <div>Error: {error.message}</div>;

  return (
    <div
      ref={mapContainerRef}
      style={{
        flex: flexSize,
        width: '100%',   // 반응형 너비
        height: '100%', // 필요에 따라 %나 vh로 변경 가능
        minWidth: 0,     // flex 컨테이너 축소 대응
      }}
    />
  );
};

export default MapTest;
