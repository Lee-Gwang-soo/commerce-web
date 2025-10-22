import { NextResponse } from "next/server";
import { serialize } from "cookie";

export async function POST() {
  try {
    const sessionCookie = serialize("user_session", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0,
      path: "/",
    });

    const response = NextResponse.json({
      success: true,
      message: "로그아웃되었습니다.",
    });

    response.headers.set("Set-Cookie", sessionCookie);

    console.log("로그아웃 성공");

    return response;
  } catch (error) {
    console.error("로그아웃 API 오류:", error);
    return NextResponse.json(
      {
        code: "INTERNAL_SERVER_ERROR",
        message: "로그아웃 처리 중 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}
