import { Link } from "react-router-dom";

function Navbar() {
    return (
        <nav style={{ display: "flex", flexDirection: "column", width: "200px" }}>
            <Link to="/">운행 정보</Link>
            <Link to="/register">차량 등록</Link>
            <Link to="/management">차량 관리</Link>
        </nav>
    );
}

export default Navbar;