import { useEffect, useRef } from 'react';

const { kakao } = window;

type MapTestProps = {
  flexSize?: number;
  level?: number;
}

const MapTest: React.FC<MapTestProps> = ({ flexSize, level=13 }) => {
  
    const mapRef = useRef<kakao.maps.Map | null>(null);

  // 맵 한 번만 생성
  useEffect(() => {
    const container = document.getElementById('map')!;
    const options = {
      center: new kakao.maps.LatLng(36.566535, 127.9709692),
      level: level
    };
    mapRef.current = new kakao.maps.Map(container, options);
  }, []);

  // 윈도우 리사이즈 시, kakao.maps.event.trigger로 리사이즈 이벤트만 트리거
  useEffect(() => {
    const handleResize = () => {
      if (mapRef.current) {
        kakao.maps.event.trigger(mapRef.current, 'resize');
        // 원래 중심이 유지되도록 재설정
        mapRef.current.setCenter(
          new kakao.maps.LatLng(36.566535, 127.9709692)
        );
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div style={{ flex: flexSize, width: '100%', height: '100%' }}>
      <div id="map" style={{ flex: flexSize, width: '100%', height: '100%' }} />
    </div>
  );
};

export default MapTest;