import { Link } from "react-router-dom";
import { useState } from "react";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/Components/ui/radio-group";
import { Button } from "@/Components/ui/button";
import { Card, CardContent } from "@/Components/ui/card";
import { UserRound, Lock, Mail, TriangleAlert, CircleCheckBig } from "lucide-react";
import Illustrator from "../../assets/illustrator.png";
import logo from "../../assets/logo.svg";
import { useAuthStore } from "@/Store/Authorization";
import { duplicate } from "@/Api/AuthApi/duplicate";
import { toast } from "sonner";

export function SignUp() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [role, setRole] = useState<"ADMIN" | "USER">("USER");
  const [isValidName, setIsValidName] = useState<boolean>(false);

  // 전역 인증 스토어 상태와 액션
  const { isAuthLoading, setAuthError, signUp } = useAuthStore();

  const isValid =
    username.trim() !== "" &&
    password.trim() !== "" &&
    email.trim() !== "" &&
    role !== null &&
    isValidName &&
    !isAuthLoading;

  const checkDuplicated = async () => {
    // TODO: 실제 중복 확인 API 연동 필요 시 store에 위임
    try{
      const duplicated = await duplicate({id: username});
      console.log("Duplicated: ",duplicated);
      if(!duplicated.ok){
        setIsValidName(false);
      } else {
        setIsValidName(true);
        toast("사용 가능한 아이디입니다.", {
      icon: <CircleCheckBig/>
    })
    }
  }
  catch{
    toast("중복 검증에 실패하였습니다. 다시 시도해 주세요", {
      icon: <TriangleAlert/>
    })
  }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || isAuthLoading) return;
    try {
      const res = await signUp({ username, password, email, role });
      toast("회원가입에 성공하였습니다", {
      icon: <CircleCheckBig/>
    });
    setUsername("");
    setPassword("");
    setEmail("");
    setRole("USER");
    setIsValidName(false);
    } catch {
      toast("회원가입에 실패하였습니다. 다시 시도해 주세요", {
      icon: <TriangleAlert/>
    })
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
          <p className="opacity-90">
            복합 인프라 시스템{" "}
            <span className="font-semibold">GPS Tracker</span>
          </p>
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
                <h1 className="text-3xl md:text-[32px] font-extrabold tracking-tight">
                  GPS Tracker 회원가입
                </h1>
                <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                  <span>이미 회원이신가요?</span>
                  <Link
                    to="/login"
                    className="font-semibold underline underline-offset-4"
                    onClick={() => setAuthError('')}
                  >
                    로그인 하기
                  </Link>
                </div>
              </div>

              <form className="space-y-4">
                {/* 아이디 */}
                <div className="space-y-2">
                  <div className="relative">
                    <UserRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <div className="flex gap-3">
                      <Input
                        id="username"
                        placeholder="아이디 입력"
                        autoComplete="username"
                        className="pl-10 h-12"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                      <Button
                      type="button"
                        variant={"outline"}
                        onClick={checkDuplicated}
                        className="h-12 text-black hover:opacity-90"
                        disabled={isValid}
                      >
                        {isValid ? "확인 완료" : "중복 확인"}
                      </Button>
                    </div>
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

                {/* 이메일 */}
                <div className="space-y-2">
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="이메일 입력"
                      autoComplete="email"
                      className="pl-10 h-12"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <RadioGroup
                    value={role}
                    onValueChange={(value) => setRole(value as "ADMIN" | "USER")}
                    className="flex justify-center gap-16"
                  >
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="USER" id="r1" />
                      <Label htmlFor="r1">일반 사용자</Label>
                    </div>
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="ADMIN" id="r2" />
                      <Label htmlFor="r2">관리자</Label>
                    </div>
                  </RadioGroup>
                </div>


                <Button
                  type="submit"
                  disabled={!isValid || isAuthLoading}
                  className="w-full h-12 bg-[#6F9AFF] text-black hover:bg-[#6F9AFF]/80 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={onSubmit}
                >
                  {isAuthLoading ? "처리 중..." : "회원가입"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
