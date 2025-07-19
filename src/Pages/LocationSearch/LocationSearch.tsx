import { useState, useRef } from 'react';
import Draggable from 'react-draggable';
import CarList from "../../Components/CarList/CarList.tsx";
import MapBasic from "@/Components/Map/MapBasic.tsx";

export type Position = {
    lat: number;
    lng: number;
    time: number;
}

export type Car = {
    number: string;
    name: string;
    mileage: number;
    status: string;
    path?: Position[];
}

function LocationSearch() {
    const [carStatusBtn, setCarStatusBtn] = useState<string>("전체");           // 전체, 운행중, 미운행, 수리중을 표현하기 위한 옵션
    const [selectedCar, setSelectedCar] = useState<Car | null>(null);          // carList 중 선택된 차량
    
    const nodeRef = useRef<HTMLDivElement>(null);
    // nodeRef엔 current속성값이 div의 DOM인 객체가 들어옴
    // nodeRef는 Draggable을 사용할 때 어떤 엘리먼트를 드래그할 지 알려주는 것 
    // bounds는 드래그 가능한 범위를 제한. bounds="parent": 부모 요소 내에서만 이동 허용
    return (
        <main className="flex-1 box-border relative">
            <MapBasic carStatus={carStatusBtn} level={12} selectedCar={selectedCar} selectedCarFocus={true}/>
            <Draggable nodeRef={nodeRef} bounds="parent" cancel="label">
                <div ref={nodeRef} className="absolute top-4 left-4 z-20 w-[200px] cursor-grab">
                    <CarList carStatusBtn={carStatusBtn} 
                            setCarStatusBtn={setCarStatusBtn}
                            selectedCar={selectedCar}
                            setSelectedCar={setSelectedCar} />
                </div>
            </Draggable>
        </main>
    );
}

export default LocationSearch;