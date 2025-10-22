import type {
  RegisterRequest,
  LoginRequest,
  UpdateUserRequest,
  AuthResponse,
  UserData,
} from "@/types/database";

// 인증 관련 API 함수들
export const authApi = {
  // 회원가입
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "회원가입에 실패했습니다.");
    }

    return result;
  },

  // 로그인
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "로그인에 실패했습니다.");
    }

    return result;
  },

  // 로그아웃
  logout: async (): Promise<{ success: boolean; message: string }> => {
    const response = await fetch("/api/auth/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "로그아웃에 실패했습니다.");
    }

    return result;
  },

  // 현재 로그인한 사용자 정보 조회
  getCurrentUser: async (): Promise<UserData> => {
    const response = await fetch("/api/auth/me", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "사용자 정보를 가져올 수 없습니다.");
    }

    return result.data;
  },

  // 회원정보 변경
  updateUser: async (
    data: UpdateUserRequest
  ): Promise<{ success: boolean; message: string; data: UserData }> => {
    const response = await fetch("/api/auth/update", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "회원정보 수정에 실패했습니다.");
    }

    return result;
  },

  // 비밀번호 변경
  updatePassword: async (
    currentPassword: string,
    newPassword: string
  ): Promise<{ success: boolean; message: string }> => {
    const response = await fetch("/api/auth/update-password", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "비밀번호 변경에 실패했습니다.");
    }

    return result;
  },

  // 비밀번호 확인
  verifyPassword: async (
    password: string
  ): Promise<{ success: boolean; message: string }> => {
    const response = await fetch("/api/auth/verify-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ password }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "비밀번호 확인에 실패했습니다.");
    }

    return result;
  },

  // 회원 탈퇴
  deleteAccount: async (): Promise<{ success: boolean; message: string }> => {
    const response = await fetch("/api/auth/delete-account", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "회원 탈퇴에 실패했습니다.");
    }

    return result;
  },
};
