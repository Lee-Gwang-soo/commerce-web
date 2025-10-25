import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase/server";

// GET - 찜목록 조회
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("user_session")?.value;

    if (!userId) {
      return NextResponse.json(
        { code: "UNAUTHORIZED", message: "로그인이 필요합니다." },
        { status: 401 }
      );
    }


    // 찜목록 조회 (product 정보 포함)
    const { data: wishlistItems, error } = await supabaseAdmin
      .from("wishlist")
      .select(`
        id,
        product_id,
        created_at,
        product:products (
          id,
          name,
          price,
          sale_price,
          images,
          category,
          stock
        )
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Wishlist fetch error:", error);
      return NextResponse.json(
        { code: "FETCH_ERROR", message: "찜목록 조회에 실패했습니다." },
        { status: 500 }
      );
    }

    return NextResponse.json(wishlistItems || []);
  } catch (error) {
    console.error("Wishlist GET error:", error);
    return NextResponse.json(
      { code: "SERVER_ERROR", message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

// POST - 찜목록에 상품 추가
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("user_session")?.value;

    if (!userId) {
      return NextResponse.json(
        { code: "UNAUTHORIZED", message: "로그인이 필요합니다." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { product_id } = body;

    if (!product_id) {
      return NextResponse.json(
        { code: "INVALID_REQUEST", message: "상품 ID가 필요합니다." },
        { status: 400 }
      );
    }


    // 이미 찜목록에 있는지 확인
    const { data: existing } = await supabaseAdmin
      .from("wishlist")
      .select("id")
      .eq("user_id", userId)
      .eq("product_id", product_id)
      .single();

    if (existing) {
      return NextResponse.json(
        { code: "ALREADY_EXISTS", message: "이미 찜목록에 있는 상품입니다." },
        { status: 400 }
      );
    }

    // 찜목록에 추가
    const { data: wishlistItem, error } = await supabaseAdmin
      .from("wishlist")
      .insert({
        user_id: userId,
        product_id,
      })
      .select()
      .single();

    if (error) {
      console.error("Wishlist insert error:", error);
      return NextResponse.json(
        { code: "INSERT_ERROR", message: "찜목록 추가에 실패했습니다." },
        { status: 500 }
      );
    }

    return NextResponse.json(wishlistItem, { status: 201 });
  } catch (error) {
    console.error("Wishlist POST error:", error);
    return NextResponse.json(
      { code: "SERVER_ERROR", message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
