import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";
import { getSession } from "@/lib/auth/session";
import { serialize } from "cookie";

export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { code: "UNAUTHORIZED", message: "로그인이 필요합니다." },
        { status: 401 }
      );
    }

    const sessionId = session.id; // UUID (commerce_user.id)

    const { error } = await supabase.from("commerce_user").delete().eq("id", sessionId);

    if (error) {
      console.error("회원 탈퇴 실패:", error);
      return NextResponse.json(
        {
          code: "DELETE_FAILED",
          message: "회원 탈퇴 처리 중 오류가 발생했습니다.",
          details: error.message,
        },
        { status: 500 }
      );
    }

    console.log("회원 탈퇴 성공");

    const clearSessionCookie = serialize("user_session", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0,
      path: "/",
    });

    const response = NextResponse.json({
      success: true,
      message: "회원 탈퇴가 완료되었습니다.",
    });

    response.headers.set("Set-Cookie", clearSessionCookie);

    return response;
  } catch (error) {
    console.error("회원 탈퇴 API 오류:", error);
    return NextResponse.json(
      {
        code: "INTERNAL_SERVER_ERROR",
        message: "회원 탈퇴 처리 중 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}
