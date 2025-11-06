import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { getSession } from "@/lib/auth/session";

// 리뷰 수정
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
    }

    const userUUID = session.id; // UUID 사용

    const body = await request.json();
    const { content, images } = body;

    if (!content) {
      return NextResponse.json({ error: "리뷰 내용은 필수입니다." }, { status: 400 });
    }

    // 리뷰 소유자 확인
    const { data: existingReview, error: fetchError } = (await supabaseAdmin
      .from("reviews")
      .select("user_id")
      .eq("id", id)
      .single()) as { data: { user_id: string } | null; error: any };

    if (fetchError || !existingReview) {
      return NextResponse.json({ error: "리뷰를 찾을 수 없습니다." }, { status: 404 });
    }

    if (existingReview.user_id !== userUUID) {
      return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });
    }

    // 리뷰 수정
    const { data: review, error: updateError } = (await (supabaseAdmin.from("reviews") as any)
      .update({
        content,
        images: images || [],
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()) as { data: any; error: any };

    if (updateError) {
      console.error("Review update error:", updateError);
      return NextResponse.json({ error: "리뷰 수정에 실패했습니다." }, { status: 500 });
    }

    return NextResponse.json(review);
  } catch (error) {
    console.error("Review update API error:", error);
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}

// Storage에서 이미지 삭제 헬퍼 함수
async function deleteImagesFromStorage(imageUrls: string[]) {
  const BUCKET_NAME = "review-images";
  const deletedFiles: string[] = [];

  for (const url of imageUrls) {
    try {
      // URL에서 파일 경로 추출
      // 예: https://xxx.supabase.co/storage/v1/object/public/review-images/userId/timestamp_random.jpg
      // -> userId/timestamp_random.jpg
      const urlParts = url.split(`${BUCKET_NAME}/`);
      if (urlParts.length > 1) {
        const filePath = urlParts[1];
        const { error } = await supabaseAdmin.storage.from(BUCKET_NAME).remove([filePath]);

        if (!error) {
          deletedFiles.push(filePath);
          console.log("이미지 삭제 성공:", filePath);
        } else {
          console.error("이미지 삭제 실패:", filePath, error);
        }
      }
    } catch (error) {
      console.error("이미지 삭제 중 에러:", error);
    }
  }

  return deletedFiles;
}

// 리뷰 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
    }

    const userUUID = session.id; // UUID 사용

    // 리뷰 소유자 확인 및 이미지 URL 가져오기
    const { data: existingReview, error: fetchError } = (await supabaseAdmin
      .from("reviews")
      .select("user_id, images")
      .eq("id", id)
      .single()) as { data: { user_id: string; images: string[] } | null; error: any };

    if (fetchError || !existingReview) {
      return NextResponse.json({ error: "리뷰를 찾을 수 없습니다." }, { status: 404 });
    }

    if (existingReview.user_id !== userUUID) {
      return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });
    }

    // Storage에서 이미지 삭제
    if (existingReview.images && existingReview.images.length > 0) {
      await deleteImagesFromStorage(existingReview.images);
    }

    // 리뷰 삭제
    const { error: deleteError } = await supabaseAdmin.from("reviews").delete().eq("id", id);

    if (deleteError) {
      console.error("Review delete error:", deleteError);
      return NextResponse.json({ error: "리뷰 삭제에 실패했습니다." }, { status: 500 });
    }

    return NextResponse.json({ message: "리뷰가 삭제되었습니다." });
  } catch (error) {
    console.error("Review delete API error:", error);
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}
