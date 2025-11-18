import type { CommerceUser } from "@/types/database";

/**
 * 데이터베이스 User 객체를 API 응답 형식으로 변환
 * snake_case -> camelCase
 */
export function transformUserForResponse(user: CommerceUser) {
  return {
    id: user.id,
    userId: user.user_id, // snake_case -> camelCase
    name: user.name,
    email: user.email,
    phone: user.phone,
    address: user.address,
    address_detail: user.address_detail,
    marketing_agreed: user.marketing_agreed,
    benefits_agreed: user.benefits_agreed,
    created_at: user.created_at,
    updated_at: user.updated_at,
  };
}

/**
 * 세션 데이터 생성
 */
export function createSessionData(user: CommerceUser) {
  return {
    id: user.id,
    userId: user.user_id, // camelCase로 저장
    name: user.name,
    email: user.email,
  };
}
