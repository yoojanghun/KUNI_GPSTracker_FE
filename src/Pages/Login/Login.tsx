import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { UserRound, Lock, CircleCheckBig, ShieldX } from "lucide-react";
import Illustrator from "../../assets/illustrator.png";
import logo from "../../assets/logo.svg";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/Store/Authorization";
import { toast } from "sonner";

export function Login() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  // 전역 인증 스토어 상태와 액션
  const { isAuthLoading, authError, login, setAuthError } = useAuthStore();

  // 로그인 페이지 이동 타입
  const logoutType = useAuthStore((state) => state.logoutType);
  const setLogOutType = useAuthStore((state) => state.setLogOutType);


  useEffect (() => { 
    if (logoutType === 'manual') {
      toast("로그아웃 되었습니다", {
        icon: <CircleCheckBig/>  
      });
      setLogOutType(null);
    }
    else if (logoutType === 'expired') {
      toast("세션이 만료되었습니다. 다시 로그인해 주세요", {
        icon: <ShieldX/>  
      });
      setLogOutType(null);
    }
   }, [])

  // 라우팅 이동 훅
  const navigate = useNavigate();
  const location = useLocation();

  const isValid = username.trim() !== "" && password.trim() !== "";

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || isAuthLoading) return;

    try {
      // 전역 스토어가 API 호출과 토큰 저장을 처리
      await login(username, password);
      console.log("로그인 성공");

      // 원래 가려던 경로(from)가 있으면 그쪽으로, 없으면 /home
      if (!isAuthLoading){
        console.log("메인페이지 이동");
        const params = new URLSearchParams(location.search);
      const from = params.get("from") ?? "/";
      navigate(from, { replace: true });
      }
      
    } catch {
      // 실패 시 authError 상태가 설정되어 있음
      // 필요한 경우 토스트나 인라인 에러 표시로 연결
      // alert(authError ?? "로그인 실패");
    }
  };
  return (
    <div className="min-h-screen w-full bg-white grid grid-cols-1 md:grid-cols-[1fr_520px]">
      {/* 좌측 이미지 패널 영역 */}
      <div className="hidden md:block relative overflow-hidden">
        <div className="absolute inset-6 rounded-2xl bg-[#377CFB]" />
        <img
          src={Illustrator}
          alt="앱 소개 일러스트"
          className="absolute inset-0 m-auto max-w-[70%] h-auto drop-shadow-xl"
        />
        <div className="absolute bottom-10 left-16 text-white">
          <p className="text-2xl font-bold">차량 관리</p>
          <p className="text-2xl font-bold">실시간 추적</p>
          <p className="text-2xl font-bold mb-3">운행 관리</p>
          <p className="opacity-90">— 모두 한 번에</p>
          <p className="opacity-90">복합 인프라 시스템 <span className="font-semibold">GPS Tracker</span></p>
        </div>
      </div>

      {/* 우측 로그인 폼 패널 영역 */}
      <div className="relative flex flex-col px-6 md:px-10">
        {/* 우측 최상단 로고 */}
        <div className="flex justify-end pt-6 pb-4">
          <img src={logo} alt="GPS Tracker" className="h-20" />
        </div>

        {/* Shadcn Card 컴포넌트를 이용해 요소 배치 */}
        <div className="flex-1 flex items-start justify-center py-16">
          <Card className="w-full max-w-[460px] shadow-none border-0">
            <CardContent className="p-0">
              <div className="mb-8">
                <h1 className="text-3xl md:text-[32px] font-extrabold tracking-tight">GPS Tracker에 로그인</h1>
                <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                  <span>회원이 아니신가요?</span>
                  <Link 
                  to="/signup" 
                  className="font-semibold underline underline-offset-4"
                  onClick={() => setAuthError('')}
                  >회원가입 하기</Link>
                </div>
              </div>

              <form className="space-y-4">
                {/* 아이디 */}
                <div className="space-y-2">
                  <div className="relative">
                    <UserRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                      id="username"
                      placeholder="아이디 입력"
                      autoComplete="username"
                      className="pl-10 h-12"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                </div>

                {/* 패스워드 */}
                <div className="space-y-2">
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="패스워드 입력"
                      autoComplete="current-password"
                      className="pl-10 h-12"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>

                {authError && (
                  <p className="text-sm text-red-600">올바르지 않은 회원 정보입니다. 아이디 또는 비밀번호를 확인해 주세요</p>
                )}

                <Button
                  type="submit"
                  className="w-full h-12 bg-[#6F9AFF] text-black hover:bg-[#6F9AFF]/80 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!isValid || isAuthLoading}
                  onClick={onSubmit}
                >
                  {isAuthLoading ? "로그인 중..." : "로그인"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}