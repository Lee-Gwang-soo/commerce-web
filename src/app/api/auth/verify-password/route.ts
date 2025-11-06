import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { getSession } from "@/lib/auth/session";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { code: "UNAUTHORIZED", message: "로그인이 필요합니다." },
        { status: 401 }
      );
    }

    const sessionId = session.id; // UUID (commerce_user.id)

    const body = await request.json();
    const { password } = body;

    if (!password) {
      return NextResponse.json(
        {
          code: "INVALID_REQUEST",
          message: "비밀번호를 입력해주세요.",
        },
        { status: 400 }
      );
    }

    const { data: user, error: fetchError } = await supabaseAdmin
      .from("commerce_user")
      .select("password")
      .eq("id", sessionId)
      .single<{ password: string }>();

    if (fetchError || !user) {
      return NextResponse.json(
        {
          code: "USER_NOT_FOUND",
          message: "사용자 정보를 찾을 수 없습니다.",
        },
        { status: 404 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        {
          code: "INVALID_PASSWORD",
          message: "비밀번호가 일치하지 않습니다.",
        },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "비밀번호 확인이 완료되었습니다.",
    });
  } catch (error) {
    console.error("비밀번호 확인 API 오류:", error);
    return NextResponse.json(
      {
        code: "INTERNAL_SERVER_ERROR",
        message: "비밀번호 확인 처리 중 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}
