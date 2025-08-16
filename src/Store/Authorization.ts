import { create } from "zustand";
import { logIn } from "@/Api/AuthApi/logIn";
import { SignUpApi } from "@/Api/AuthApi/signUp";

// 로컬 스토리지 키 상수
const AUTH_STORAGE_KEY = "auth";

// 인증 상태 타입
interface AuthState {
  token: string | null;
  isBootstrapping: boolean;

  isAuthLoading: boolean;
  authError: string | null;

  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  bootstrapFromStorage: () => Promise<void>;
  signUp: (params: { username: string; password: string; email: string; role: "ADMIN" | "USER" }) => Promise<boolean>;
  setAuthError: (err: string) => void;
}

// Zustand 스토어 생성
export const useAuthStore = create<AuthState>((set, get) => ({
  token: null,
  isBootstrapping: true,

  isAuthLoading: false,
  authError: null,

  // 아이디/비밀번호로 로그인 요청을 전역에서 처리
  login: async (username: string, password: string) => {
    // 로딩 상태 시작
    set({ isAuthLoading: true, authError: null });
    try {
      // 로그인 API 호출 (요청 본문에 JSON 전송)
      const res = await logIn({ id: username.trim(), password: password.trim() });
      if (!res?.token) {
        throw new Error("토큰이 응답에 없습니다.");
      }
      // 토큰 저장 처리
      set({token: res.token});
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ token: res.token }));

    } catch (err: any) {
      // 에러 메시지 저장
      set({ authError: err?.message ?? "로그인에 실패했습니다." });
      // 컴포넌트에서 분기 가능하도록 예외 전파
      throw err;
    } finally {
      // 로딩 상태 종료
      set({ isAuthLoading: false });
    }
  },

  // 회원가입 요청을 전역에서 처리
  signUp: async ({ username, password, email, role }) => {
    set({ isAuthLoading: true, authError: null });
    try {
      // 회원가입 API 호출 (서버 스펙에 맞춰 엔드포인트 조정 가능)
      const resp = await SignUpApi({ id: username.trim(), password: password.trim(), email: email.trim(), role: role.trim() as "ADMIN" | "USER" });
      if (resp.id !== username.trim()) {
        
          throw new Error("회원가입 요청에 실패했습니다.");
      }
      else{
        return true;
      }
    } catch (err: any) {
      set({ authError: err?.message ?? "회원가입에 실패했습니다." });
      throw err;
    } finally {
      set({ isAuthLoading: false });
    }
  },

  // 로그아웃 처리: 상태/스토리지 초기화
  logout: () => {
    set({ token: null });
    localStorage.removeItem(AUTH_STORAGE_KEY);

    // 라우팅 처리 필요 시 window.location 사용 (라우터 의존성 제거 목적)

    try {
      if (window.location.pathname !== "/") {
        // window.location.replace("/login"); // 로그인 페이지로 이동하도록 라우팅 구조에 맞게 조정
      }
    } catch {
      // 브라우저 환경 가정
    }
  },

  // 앱 부팅 시 스토리지에서 세션 복원
  bootstrapFromStorage: async () => {
    try {
      const raw = localStorage.getItem(AUTH_STORAGE_KEY);
      if (!raw) {
        set({ isBootstrapping: false });
        return;
      }
      const parsed = JSON.parse(raw) as { token?: string };

      if (parsed?.token) {
        set({ token: parsed.token });
        // 임의 api 호출: 서버 기준 토큰 유효성 확인
        // fetchActiveCarStat();
      } else {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    } finally {
      set({ isBootstrapping: false });
    }
  },

  setAuthError: (err) => set({ authError: err }),
}));




// TODO: 스토리지 이벤트를 통한 다중 탭 동기화
