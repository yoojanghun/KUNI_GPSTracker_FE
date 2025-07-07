import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar.tsx";
import Home from "./Pages/Home.tsx";
import RegisterCar from "./Pages/RegisterCar.tsx";
import Management from "./Pages/Management.tsx";

function App() {
  return (
    <Router>
      <div style={{ display: "flex" }}>
        <Navbar />
        <div style={{ padding: "20px", flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<RegisterCar />} />
            <Route path="/management" element={<Management />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;