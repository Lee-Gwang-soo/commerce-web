import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import bcrypt from "bcryptjs";
import { parse } from "cookie";

export async function PUT(request: NextRequest) {
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

    // 현재 사용자 정보 조회
    const { data: currentUser, error: fetchError } = await supabaseAdmin
      .from("commerce_user")
      .select("*")
      .eq("id", sessionId)
      .single();

    if (fetchError || !currentUser) {
      return NextResponse.json(
        {
          code: "USER_NOT_FOUND",
          message: "사용자를 찾을 수 없습니다.",
        },
        { status: 404 }
      );
    }

    const body = await request.json();
    const {
      email,
      phone,
      address,
      currentPassword,
      newPassword,
      marketing_agreed,
      benefits_agreed
    } = body;

    console.log("요청 body:", { email, phone, address, currentPassword: !!currentPassword, newPassword: !!newPassword });

    const updateData: any = {};

    // 비밀번호 변경 로직
    if (newPassword) {
      // 새 비밀번호가 있으면 현재 비밀번호 확인 필수
      if (!currentPassword) {
        return NextResponse.json(
          {
            code: "CURRENT_PASSWORD_REQUIRED",
            message: "비밀번호 변경 시 현재 비밀번호를 입력해주세요.",
          },
          { status: 400 }
        );
      }

      // 현재 비밀번호 검증
      const isPasswordValid = await bcrypt.compare(currentPassword, currentUser.password);
      if (!isPasswordValid) {
        return NextResponse.json(
          {
            code: "INVALID_PASSWORD",
            message: "현재 비밀번호가 일치하지 않습니다.",
          },
          { status: 401 }
        );
      }

      // 새 비밀번호 해시화
      updateData.password = await bcrypt.hash(newPassword, 10);
    }

    // 이메일 업데이트 (변경 시 중복 체크)
    if (email !== undefined) {
      if (email !== currentUser.email) {
        // 이메일이 변경된 경우 중복 체크
        const { data: existingEmail } = await supabaseAdmin
          .from("commerce_user")
          .select("id")
          .eq("email", email)
          .neq("id", sessionId);

        if (existingEmail && existingEmail.length > 0) {
          return NextResponse.json(
            {
              code: "EMAIL_EXISTS",
              message: "이미 사용 중인 이메일입니다.",
            },
            { status: 409 }
          );
        }
      }
      updateData.email = email;
    }

    // 나머지 필드 업데이트
    if (phone !== undefined) updateData.phone = phone;
    if (address !== undefined) updateData.address = address;
    if (marketing_agreed !== undefined) updateData.marketing_agreed = marketing_agreed;
    if (benefits_agreed !== undefined) updateData.benefits_agreed = benefits_agreed;

    console.log("업데이트 데이터:", updateData);
    console.log("세션 ID:", sessionId);

    // 업데이트 실행
    const { data: updatedUsers, error: updateError } = await supabaseAdmin
      .from("commerce_user")
      .update(updateData)
      .eq("id", sessionId)
      .select("id, user_id, name, email, phone, address, marketing_agreed, benefits_agreed, created_at, updated_at");

    console.log("업데이트 결과:", { updatedUsers, updateError });

    if (updateError) {
      console.error("회원정보 수정 실패:", updateError);
      return NextResponse.json(
        {
          code: "UPDATE_FAILED",
          message: "회원정보 수정 중 오류가 발생했습니다.",
          details: updateError.message,
        },
        { status: 500 }
      );
    }

    if (!updatedUsers || updatedUsers.length === 0) {
      console.error("업데이트된 사용자 없음. sessionId:", sessionId);
      return NextResponse.json(
        {
          code: "UPDATE_FAILED",
          message: "회원정보 수정 중 오류가 발생했습니다.",
          details: "사용자를 찾을 수 없습니다.",
        },
        { status: 500 }
      );
    }

    const updatedUser = updatedUsers[0];

    console.log("회원정보 수정 성공:", {
      userId: updatedUser.user_id,
      name: updatedUser.name,
      email: updatedUser.email,
    });

    return NextResponse.json({
      success: true,
      message: "회원정보가 수정되었습니다.",
      data: {
        id: updatedUser.id,
        userId: updatedUser.user_id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        address: updatedUser.address,
        marketing_agreed: updatedUser.marketing_agreed,
        benefits_agreed: updatedUser.benefits_agreed,
        created_at: updatedUser.created_at,
        updated_at: updatedUser.updated_at,
      },
    });
  } catch (error) {
    console.error("회원정보 수정 API 오류:", error);
    return NextResponse.json(
      {
        code: "INTERNAL_SERVER_ERROR",
        message: "회원정보 수정 처리 중 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}
