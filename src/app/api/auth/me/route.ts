import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { getSession } from "@/lib/auth/session";
import type { CommerceUser } from "@/types/database";
import { transformUserForResponse } from "@/lib/utils/transformUser";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        {
          code: "UNAUTHORIZED",
          message: "로그인이 필요합니다.",
        },
        { status: 401 }
      );
    }

    const userId = session.id; // UUID (commerce_user.id)

    const { data: user, error: fetchError } = await supabaseAdmin
      .from("commerce_user")
      .select(
        "id, user_id, name, email, phone, address, address_detail, marketing_agreed, benefits_agreed, created_at, updated_at"
      )
      .eq("id", userId)
      .single<CommerceUser>();

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
      data: transformUserForResponse(user),
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
