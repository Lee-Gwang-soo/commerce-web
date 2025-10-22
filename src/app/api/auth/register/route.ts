import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, password, name, email, phone, address, marketing_agreed, benefits_agreed } = body;

    if (!userId || !password || !name || !email || !phone || !address) {
      return NextResponse.json(
        {
          code: "INVALID_REQUEST",
          message: "필수 파라미터가 누락되었습니다.",
        },
        { status: 400 }
      );
    }

    const { data: existingUser, error: checkError } = await supabase
      .from("commerce_user")
      .select("user_id")
      .eq("user_id", userId)
      .single();

    if (existingUser) {
      return NextResponse.json(
        {
          code: "USER_EXISTS",
          message: "이미 존재하는 아이디입니다.",
        },
        { status: 409 }
      );
    }

    const { data: existingEmail, error: emailCheckError } = await supabase
      .from("commerce_user")
      .select("email")
      .eq("email", email)
      .single();

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

    const { data, error } = await supabase
      .from("commerce_user")
      .insert([
        {
          user_id: userId,
          password: hashedPassword,
          name,
          email,
          phone,
          address,
          marketing_agreed: marketing_agreed || false,
          benefits_agreed: benefits_agreed || false,
        },
      ])
      .select()
      .single();

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
      data: {
        id: data.id,
        userId: data.user_id,
        name: data.name,
        email: data.email,
      },
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
