import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Home from "./Pages/Home/Home.tsx";
import Management from "./Pages/Management/Management.tsx";
import DrivingLog from "./Pages/DriveLog/DrivingLog.tsx";
import LocationSearch from "./Pages/LocationSearch/LocationSearch.tsx";
import { Login } from "./Pages/Login/Login.tsx";
import { SignUp } from "./Pages/Login/SignUp.tsx";
import { DLogDetails } from "./Pages/DriveLog/DLogDetails.tsx";
import { Toaster } from "sonner";
import { ProtectedRoute, PublicOnlyRoute } from "./gaurds.tsx";
import { useAuthStore } from "./Store/Authorization";
import { AppLayout } from "./AppLayout.tsx";

function App() {
  // 앱 부팅 시 스토리지에서 인증 복원
  useEffect(() => {
    useAuthStore.getState().bootstrapFromStorage();
  }, []);

  return (
    <Router>
      <Toaster offset={64} position="bottom-center" />

      {/* 공개 전용 라우트: 로그인/회원가입 */}
      <Routes>
        <Route element={<PublicOnlyRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
        </Route>

        {/* 보호 라우트: 인증 필요 페이지 */}
        <Route element={<ProtectedRoute />}>
          <Route
            path="/"
            element={
              <AppLayout>
                <div className="flex">
                  
                  <Home />
                </div>
              </AppLayout>
            }
          />
          <Route
            path="/location"
            element={
              <AppLayout>
                <div className="flex">
                  
                  <LocationSearch />
                </div>
              </AppLayout>
            }
          />
          <Route
            path="/management"
            element={
              <AppLayout>
                <div className="flex">
                  
                  <Management />
                </div>
              </AppLayout>
            }
          />
          <Route
            path="/log"
            element={
              <AppLayout>
                <div className="flex">
                  
                  <DrivingLog />
                </div>
              </AppLayout>
            }
          />
          <Route
            path="/log/:Id"
            element={
              <AppLayout>
                <div className="flex">
                  
                  <DLogDetails />
                </div>
              </AppLayout>
            }
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
