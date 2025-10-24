import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";

// DELETE - 찜목록에서 상품 제거
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("user_session")?.value;

    if (!userId) {
      return NextResponse.json(
        { code: "UNAUTHORIZED", message: "로그인이 필요합니다." },
        { status: 401 }
      );
    }

    const { id } = await params;

    const supabase = await createClient();

    // 찜목록 아이템 삭제
    const { error } = await supabase
      .from("wishlist")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    if (error) {
      console.error("Wishlist delete error:", error);
      return NextResponse.json(
        { code: "DELETE_ERROR", message: "찜목록 삭제에 실패했습니다." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "찜목록에서 제거되었습니다." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Wishlist DELETE error:", error);
    return NextResponse.json(
      { code: "SERVER_ERROR", message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
