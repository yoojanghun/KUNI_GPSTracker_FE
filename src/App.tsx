import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar.tsx";
import Home from "./Pages/Home/Home.tsx";
import Management from "./Pages/Management/Management.tsx";
import { ManageTest } from "./Pages/Management/ManageTest.tsx";
import DrivingLog from "./Pages/DriveLog/DrivingLog.tsx";
import LocationSearch from "./Pages/LocationSearch/LocationSearch.tsx";
import { DLogDetails } from "./Pages/DriveLog/DLogDetails.tsx";
import { Toaster } from "sonner";

function App() {
  return (
    <Router>
      <div className="flex">
        <Navbar />
        <Toaster offset={64} position="bottom-center" /> 
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/location" element={<LocationSearch />}/>
          <Route path="/management" element={<ManageTest />} />
          <Route path="/log" element={<DrivingLog />} />
          <Route path="/log/:Id" element={<DLogDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;