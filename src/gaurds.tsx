import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "@/Store/Authorization";

// ProtectedRoute
// 토큰이 없으면 로그인 페이지로 이동시키고, 있으면 자식 라우트를 렌더링

export function ProtectedRoute() {
  // 인증 상태 조회

  const { token, isBootstrapping } = useAuthStore();
  const location = useLocation();

  // 앱 부팅 중에는 깜빡임 방지를 위해 간단한 로딩 UI를 표시

  if (isBootstrapping) {
    return (
      <div className="w-full h-screen flex items-center justify-center text-sm text-muted-foreground">
        초기화 중...
      </div>
    );
  }

  // 토큰이 없으면 로그인 페이지로 이동

  if (!token) {
    const from = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?from=${from}`} replace />;
  }

  // 토큰이 있으면 자식 라우트 렌더링

  return <Outlet />;
}

// PublicOnlyRoute
// 이미 로그인된 사용자가 로그인/회원가입 같은 공개 페이지에 접근하면 홈으로 보내기

export function PublicOnlyRoute() {
  // 인증 상태 조회

  const { token, isBootstrapping } = useAuthStore();

  // 부팅 중에는 로딩 UI 표시

  if (isBootstrapping) {
    return (
      <div className="w-full h-screen flex items-center justify-center text-sm text-muted-foreground">
        초기화 중...
      </div>
    );
  }

  // 토큰이 있으면 홈으로 이동

  if (token) {
    return <Navigate to="/" replace />;
  }

  // 토큰이 없으면 공개 라우트 렌더링

  return <Outlet />;
}