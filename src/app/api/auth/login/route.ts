import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";
import bcrypt from "bcryptjs";
import { serialize } from "cookie";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, password } = body;

    if (!userId || !password) {
      return NextResponse.json(
        {
          code: "INVALID_REQUEST",
          message: "아이디와 비밀번호를 입력해주세요.",
        },
        { status: 400 }
      );
    }

    const { data: user, error: fetchError } = await supabase
      .from("commerce_user")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (fetchError || !user) {
      return NextResponse.json(
        {
          code: "USER_NOT_FOUND",
          message: "아이디 또는 비밀번호가 일치하지 않습니다.",
        },
        { status: 401 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        {
          code: "INVALID_PASSWORD",
          message: "아이디 또는 비밀번호가 일치하지 않습니다.",
        },
        { status: 401 }
      );
    }

    console.log("로그인 성공:", {
      userId: user.user_id,
      name: user.name,
      email: user.email,
    });

    const sessionCookie = serialize("user_session", user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    const response = NextResponse.json({
      success: true,
      message: "로그인에 성공했습니다.",
      data: {
        id: user.id,
        userId: user.user_id,
        name: user.name,
        email: user.email,
      },
    });

    response.headers.set("Set-Cookie", sessionCookie);

    return response;
  } catch (error) {
    console.error("로그인 API 오류:", error);
    return NextResponse.json(
      {
        code: "INTERNAL_SERVER_ERROR",
        message: "로그인 처리 중 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}
