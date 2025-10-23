import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/lib/api/auth";
import { useAuthStore } from "@/store/authStore";
import type {
  RegisterRequest,
  LoginRequest,
  UpdateUserRequest,
} from "@/types/database";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { toast } from "sonner";

// 인증 상태 hook
export const useAuth = () => {
  const { user, isAuthenticated, setUser, logout } = useAuthStore();

  return {
    user,
    isAuthenticated,
    isLoading: false,
  };
};

// 회원가입 hook
export const useRegister = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: RegisterRequest) => authApi.register(data),
    onSuccess: (data) => {
      toast.success("회원가입이 완료되었습니다.");
      router.push(
        `/register/complete?name=${encodeURIComponent(data.data?.name || "")}`
      );
    },
    onError: (error: Error) => {
      toast.error(error.message || "회원가입에 실패했습니다.");
    },
  });
};

// 로그인 hook
export const useLogin = () => {
  const { setUser } = useAuthStore();
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onSuccess: (data) => {
      if (data.data) {
        setUser(data.data as any);
        queryClient.invalidateQueries({ queryKey: ["currentUser"] });
        toast.success("로그인에 성공했습니다.");
        router.push("/");
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || "로그인에 실패했습니다.");
    },
  });
};

// 로그아웃 hook
export const useLogout = () => {
  const { logout: logoutStore } = useAuthStore();
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      logoutStore();
      queryClient.clear();
      toast.success("로그아웃되었습니다.");
      router.push("/");
    },
    onError: (error: Error) => {
      toast.error(error.message || "로그아웃에 실패했습니다.");
    },
  });
};

// 현재 사용자 조회 hook (최적화)
export const useCurrentUser = () => {
  const { user, isAuthenticated, setUser } = useAuthStore();

  return useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      try {
        const data = await authApi.getCurrentUser();
        setUser(data);
        return data;
      } catch (error) {
        // 401 에러는 정상 케이스 (비로그인)
        if ((error as any)?.status === 401) {
          return null;
        }
        throw error;
      }
    },
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
    retry: false,
    refetchOnWindowFocus: false,
  });
};

// 회원정보 수정 hook
export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  const { setUser } = useAuthStore();

  return useMutation({
    mutationFn: (data: UpdateUserRequest) => authApi.updateUser(data),
    onSuccess: (response) => {
      if (response.data) {
        setUser(response.data);
        queryClient.invalidateQueries({ queryKey: ["currentUser"] });
        toast.success("회원정보가 수정되었습니다.");
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || "회원정보 수정에 실패했습니다.");
    },
  });
};

// 비밀번호 확인 hook
export const useVerifyPassword = () => {
  return useMutation({
    mutationFn: (password: string) => authApi.verifyPassword(password),
    onError: (error: Error) => {
      toast.error(error.message || "비밀번호 확인에 실패했습니다.");
    },
  });
};

// 회원 탈퇴 hook
export const useDeleteAccount = () => {
  const { logout: logoutStore } = useAuthStore();
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: () => authApi.deleteAccount(),
    onSuccess: () => {
      logoutStore();
      queryClient.clear();
      toast.success("회원 탈퇴가 완료되었습니다.");
      router.push("/");
    },
    onError: (error: Error) => {
      toast.error(error.message || "회원 탈퇴에 실패했습니다.");
    },
  });
};
