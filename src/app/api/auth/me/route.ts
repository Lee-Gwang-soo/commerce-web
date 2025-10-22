import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";
import { parse } from "cookie";

export async function GET(request: NextRequest) {
  try {
    const cookies = parse(request.headers.get("cookie") || "");
    const sessionId = cookies.user_session;

    if (!sessionId) {
      return NextResponse.json(
        {
          code: "UNAUTHORIZED",
          message: "로그인이 필요합니다.",
        },
        { status: 401 }
      );
    }

    const { data: user, error: fetchError } = await supabase
      .from("commerce_user")
      .select("id, user_id, name, email, phone, address, marketing_agreed, benefits_agreed, created_at, updated_at")
      .eq("id", sessionId)
      .single();

    if (fetchError || !user) {
      return NextResponse.json(
        {
          code: "USER_NOT_FOUND",
          message: "사용자 정보를 찾을 수 없습니다.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: user.id,
        userId: user.user_id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        marketing_agreed: user.marketing_agreed,
        benefits_agreed: user.benefits_agreed,
        created_at: user.created_at,
        updated_at: user.updated_at,
      },
    });
  } catch (error) {
    console.error("사용자 정보 조회 API 오류:", error);
    return NextResponse.json(
      {
        code: "INTERNAL_SERVER_ERROR",
        message: "사용자 정보 조회 중 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}
