import { useEffect, useState } from 'react';

const { kakao } = window;

const MapTest = () => {
    const [map,setMap] = useState(null);

    //처음 지도 그리기
    useEffect(()=>{
        const container = document.getElementById('map');
        const options = { center: new kakao.maps.LatLng(37.566535, 126.9779692) };
        const kakaoMap = new kakao.maps.Map(container, options);
        setMap(kakaoMap);
    },[])

    return (
        <div style={{ width: '100%', display: 'inline-block' }}>
            <div id="map" style={{ width: '100%', height: '500px' }}></div>
        </div>
    );
};

export default MapTest;