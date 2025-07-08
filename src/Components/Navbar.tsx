import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

function Navbar() {
    return (
        <nav style={{ display: "flex", flexDirection: "column", width: "200px" }}>
            <Link to="/"><img src={logo} alt="logo" /></Link>
            <Link to="/">운행 정보</Link>
            <Link to="/location">위치 조회</Link>
            <Link to="/management">차량 관리</Link>
            <Link to="/log">운행 일지</Link>
        </nav>
    );
}

export default Navbar;