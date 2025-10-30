import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import bcrypt from "bcryptjs";
import type { CommerceUser } from "@/types/database";
import { transformUserForResponse } from "@/lib/utils/transformUser";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { user_id, password, name, email, phone, address, marketing_agreed, benefits_agreed } =
      body;

    if (!user_id || !password || !name || !email || !phone || !address) {
      return NextResponse.json(
        {
          code: "INVALID_REQUEST",
          message: "필수 파라미터가 누락되었습니다.",
        },
        { status: 400 }
      );
    }

    const { data: existingUser, error: checkError } = await supabaseAdmin
      .from("commerce_user")
      .select("user_id")
      .eq("user_id", user_id)
      .maybeSingle();

    if (existingUser) {
      return NextResponse.json(
        {
          code: "USER_EXISTS",
          message: "이미 존재하는 아이디입니다.",
        },
        { status: 409 }
      );
    }

    const { data: existingEmail, error: emailCheckError } = await supabaseAdmin
      .from("commerce_user")
      .select("email")
      .eq("email", email)
      .maybeSingle();

    if (existingEmail) {
      return NextResponse.json(
        {
          code: "EMAIL_EXISTS",
          message: "이미 존재하는 이메일입니다.",
        },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const { data, error } = await supabaseAdmin
      .from("commerce_user")
      .insert({
        user_id: user_id,
        password: hashedPassword,
        name,
        email,
        phone,
        address,
        marketing_agreed: marketing_agreed || false,
        benefits_agreed: benefits_agreed || false,
      } as any)
      .select()
      .single<CommerceUser>();

    if (error) {
      console.error("회원가입 실패:", error);
      return NextResponse.json(
        {
          code: "REGISTRATION_FAILED",
          message: "회원가입 처리 중 오류가 발생했습니다.",
          details: error.message,
        },
        { status: 500 }
      );
    }

    console.log("회원가입 성공:", {
      userId: data.user_id,
      name: data.name,
      email: data.email,
    });

    return NextResponse.json({
      success: true,
      message: "회원가입이 완료되었습니다.",
      data: transformUserForResponse(data),
    });
  } catch (error) {
    console.error("회원가입 API 오류:", error);
    return NextResponse.json(
      {
        code: "INTERNAL_SERVER_ERROR",
        message: "회원가입 처리 중 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}
