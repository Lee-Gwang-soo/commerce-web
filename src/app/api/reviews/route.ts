import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { getSession } from "@/lib/auth/session";

// 리뷰 작성
export async function POST(request: NextRequest) {
  try {
    console.log("=== 리뷰 작성 API 시작 ===");

    const session = await getSession();

    if (!session) {
      console.log("세션 없음");
      return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
    }

    const userUUID = session.id; // commerce_user.id (UUID)
    console.log("User UUID:", userUUID);

    const body = await request.json();
    const { product_id, content, images = [] } = body;
    console.log("Request body:", { product_id, content, imagesCount: images.length });

    if (!product_id || !content) {
      console.log("필수 필드 누락");
      return NextResponse.json({ error: "상품 ID와 리뷰 내용은 필수입니다." }, { status: 400 });
    }

    // 사용자 이름 조회 (UUID로 조회)
    console.log("사용자 정보 조회 중...");
    const { data: user, error: userError } = await supabaseAdmin
      .from("commerce_user")
      .select("name")
      .eq("id", userUUID)
      .single();

    if (userError) {
      console.error("사용자 조회 에러:", userError);
    }

    if (userError || !user) {
      console.log("사용자를 찾을 수 없음");
      return NextResponse.json({ error: "사용자 정보를 찾을 수 없습니다." }, { status: 404 });
    }

    console.log("사용자 이름:", user.name);

    // 리뷰 작성 (user_id에 UUID 사용)
    console.log("리뷰 insert 시도...");
    const { data: review, error: reviewError } = await supabaseAdmin
      .from("reviews")
      .insert({
        product_id,
        user_id: userUUID, // UUID 사용
        user_name: user.name,
        content,
        images,
      })
      .select()
      .single();

    if (reviewError) {
      console.error("Review creation error:", reviewError);
      console.error("Review error details:", JSON.stringify(reviewError, null, 2));
      return NextResponse.json(
        {
          error: "리뷰 작성에 실패했습니다.",
          details: reviewError.message,
        },
        { status: 500 }
      );
    }

    console.log("리뷰 작성 성공:", review?.id);
    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error("Review API error:", error);
    console.error("Error stack:", error instanceof Error ? error.stack : "");
    return NextResponse.json(
      {
        error: "서버 오류가 발생했습니다.",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

// 내 리뷰 목록 조회
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
    }

    const userUUID = session.id; // UUID 사용

    // 내 리뷰 목록 조회 (상품 정보 포함)
    const { data: reviews, error } = await supabaseAdmin
      .from("reviews")
      .select(
        `
        *,
        product:products (
          id,
          name,
          images,
          price,
          sale_price
        )
      `
      )
      .eq("user_id", userUUID)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Reviews fetch error:", error);
      return NextResponse.json({ error: "리뷰 목록 조회에 실패했습니다." }, { status: 500 });
    }

    return NextResponse.json(reviews);
  } catch (error) {
    console.error("Reviews API error:", error);
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}
