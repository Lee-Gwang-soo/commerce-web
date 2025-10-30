import { cookies } from "next/headers";

export interface SessionData {
  id: string; // commerce_user.id (UUID)
  userId: string; // commerce_user.user_id (로그인 아이디)
  name: string;
  email: string;
}

/**
 * 세션 쿠키에서 사용자 정보를 가져옵니다.
 * @returns SessionData 또는 null (세션이 없는 경우)
 */
export async function getSession(): Promise<SessionData | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("user_session");

    if (!sessionCookie) {
      return null;
    }

    // JSON 파싱
    const session = JSON.parse(sessionCookie.value) as SessionData;
    return session;
  } catch (error) {
    console.error("세션 파싱 에러:", error);
    return null;
  }
}

/**
 * 세션에서 사용자 ID (UUID)를 가져옵니다.
 */
export async function getUserIdFromSession(): Promise<string | null> {
  const session = await getSession();
  return session?.id || null;
}

/**
 * 세션에서 로그인 아이디를 가져옵니다.
 */
export async function getUserLoginIdFromSession(): Promise<string | null> {
  const session = await getSession();
  return session?.userId || null;
}
