import { supabase } from "@/lib/supabase/client";
import type { ProfileInsert, ProfileUpdate } from "@/types/database";

// 인증 관련 API 함수들
export const authApi = {
  // 이메일 회원가입
  signUp: async (
    email: string,
    password: string,
    userData?: Partial<ProfileInsert>
  ) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
      },
    });

    if (error) throw error;
    return data;
  },

  // 이메일 로그인
  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  },

  // 로그아웃
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  // 비밀번호 재설정 요청
  resetPassword: async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    if (error) throw error;
  },

  // 비밀번호 업데이트
  updatePassword: async (password: string) => {
    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) throw error;
  },

  // 현재 사용자 정보 조회
  getCurrentUser: async () => {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) throw error;
    return user;
  },

  // 프로필 조회
  getProfile: async (userId: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) throw error;
    return data;
  },

  // 프로필 업데이트
  updateProfile: async (userId: string, updates: ProfileUpdate) => {
    const { data, error } = await supabase
      .from("profiles")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // 프로필 생성 (회원가입 후 자동 호출)
  createProfile: async (userData: ProfileInsert) => {
    const { data, error } = await supabase
      .from("profiles")
      .insert(userData)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};
