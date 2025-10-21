import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/lib/api/auth";
import { useAuth as useAuthContext } from "@/lib/providers/auth-provider";
import { toast } from "sonner";

// 인증 관련 React Query 훅들
export const useAuth = () => {
  return useAuthContext();
};

// 로그인 훅
export const useSignIn = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authApi.signIn(email, password),
    onSuccess: () => {
      toast.success("로그인에 성공했습니다.");
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "로그인에 실패했습니다.");
    },
  });
};

// 회원가입 훅
export const useSignUp = () => {
  return useMutation({
    mutationFn: ({
      email,
      password,
      userData,
    }: {
      email: string;
      password: string;
      userData?: any;
    }) => authApi.signUp(email, password, userData),
    onSuccess: () => {
      toast.success("회원가입에 성공했습니다. 이메일을 확인해주세요.");
    },
    onError: (error: any) => {
      toast.error(error.message || "회원가입에 실패했습니다.");
    },
  });
};

// 로그아웃 훅
export const useSignOut = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.signOut,
    onSuccess: () => {
      toast.success("로그아웃되었습니다.");
      queryClient.clear();
    },
    onError: (error: any) => {
      toast.error(error.message || "로그아웃에 실패했습니다.");
    },
  });
};

// 비밀번호 재설정 훅
export const useResetPassword = () => {
  return useMutation({
    mutationFn: authApi.resetPassword,
    onSuccess: () => {
      toast.success("비밀번호 재설정 이메일이 발송되었습니다.");
    },
    onError: (error: any) => {
      toast.error(error.message || "비밀번호 재설정 요청에 실패했습니다.");
    },
  });
};

// 비밀번호 업데이트 훅
export const useUpdatePassword = () => {
  return useMutation({
    mutationFn: authApi.updatePassword,
    onSuccess: () => {
      toast.success("비밀번호가 성공적으로 변경되었습니다.");
    },
    onError: (error: any) => {
      toast.error(error.message || "비밀번호 변경에 실패했습니다.");
    },
  });
};

// 프로필 조회 훅
export const useProfile = (userId?: string) => {
  return useQuery({
    queryKey: ["profile", userId],
    queryFn: () => authApi.getProfile(userId!),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5분
  });
};

// 프로필 업데이트 훅
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, updates }: { userId: string; updates: any }) =>
      authApi.updateProfile(userId, updates),
    onSuccess: (data) => {
      toast.success("프로필이 성공적으로 업데이트되었습니다.");
      queryClient.setQueryData(["profile", data.id], data);
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "프로필 업데이트에 실패했습니다.");
    },
  });
};
