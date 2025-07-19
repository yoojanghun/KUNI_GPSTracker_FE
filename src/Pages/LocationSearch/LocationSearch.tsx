import { useRef } from 'react';
import Draggable from 'react-draggable';
import CarList from "../../Components/CarList/CarList.tsx";
import MapBasic from "@/Components/Map/MapBasic.tsx";

function LocationSearch() {
    const nodeRef = useRef<HTMLDivElement>(null);

    return (
        <main className="flex-1 box-border relative">
            <MapBasic level={12} selectedCarFocus={true}/>
            <Draggable nodeRef={nodeRef} bounds="parent" cancel="label">
                <div ref={nodeRef} className="absolute top-4 left-4 z-20 w-[200px] cursor-grab">
                    <CarList />
                </div>
            </Draggable>
        </main>
    );
}

export default LocationSearch;

// nodeRef엔 current속성값이 div의 DOM인 객체가 들어옴
// nodeRef는 Draggable을 사용할 때 어떤 엘리먼트를 드래그할 지 알려주는 것 
// bounds는 드래그 가능한 범위를 제한. bounds="parent": 부모 요소 내에서만 이동 허용