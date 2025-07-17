import { useEffect } from "react";

function Test() {
    useEffect(() => {
        fetch("/carListExample.json")           // 그냥 json 가져옴
        .then(res => res.json())                // 그 json을 자바스크립트 객체로 파싱
        .then(data => console.log(data));       // 그 객체를 저장하려면 useState사용
    }, [])

    return(
        <h1 style={{ display: "none" }}></h1>
    )
}

export default Test;