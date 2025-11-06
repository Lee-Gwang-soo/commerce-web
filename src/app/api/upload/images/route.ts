import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { getSession } from "@/lib/auth/session";

const BUCKET_NAME = "review-images";

// Storage 버킷 생성 (없으면)
async function ensureBucketExists() {
  try {
    const { data: buckets } = await supabaseAdmin.storage.listBuckets();
    const bucketExists = buckets?.some((bucket) => bucket.name === BUCKET_NAME);

    if (!bucketExists) {
      const { error } = await supabaseAdmin.storage.createBucket(BUCKET_NAME, {
        public: true,
        fileSizeLimit: 5242880, // 5MB
        allowedMimeTypes: ["image/png", "image/jpeg", "image/jpg", "image/webp"],
      });

      if (error) {
        console.error("버킷 생성 실패:", error);
        return false;
      }
      console.log("Storage 버킷 생성 완료:", BUCKET_NAME);
    }
    return true;
  } catch (error) {
    console.error("버킷 확인/생성 에러:", error);
    return false;
  }
}

// 이미지 업로드 API
export async function POST(request: NextRequest) {
  try {
    console.log("=== 이미지 업로드 API 시작 ===");

    // 인증 확인
    console.log("1. 세션 확인...");
    const session = await getSession();

    if (!session) {
      console.log("세션 없음");
      return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
    }

    console.log("2. userId 추출:", session.id);
    const userId = session.id; // UUID 사용

    // 버킷 확인/생성
    console.log("5. Storage 버킷 확인...");
    const bucketReady = await ensureBucketExists();
    if (!bucketReady) {
      console.log("버킷 준비 실패");
      return NextResponse.json({ error: "Storage 버킷 준비 실패" }, { status: 500 });
    }
    console.log("6. 버킷 준비 완료");

    // FormData에서 이미지 파일 받기
    console.log("7. FormData 파싱 시작...");
    const formData = await request.formData();
    console.log("8. FormData 파싱 완료");
    const files = formData.getAll("images") as File[];
    console.log("9. 파일 개수:", files.length);

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "업로드할 이미지가 없습니다." }, { status: 400 });
    }

    // 최대 5개 제한
    if (files.length > 5) {
      return NextResponse.json(
        { error: "이미지는 최대 5개까지 업로드 가능합니다." },
        { status: 400 }
      );
    }

    const uploadedUrls: string[] = [];

    // 각 파일을 Storage에 업로드
    for (const file of files) {
      // 파일 크기 체크 (5MB)
      if (file.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          { error: `파일 ${file.name}이(가) 너무 큽니다. 최대 5MB까지 가능합니다.` },
          { status: 400 }
        );
      }

      // 파일 확장자 체크
      const fileExt = file.name.split(".").pop()?.toLowerCase();
      if (!["jpg", "jpeg", "png", "webp"].includes(fileExt || "")) {
        return NextResponse.json(
          { error: `${file.name}은(는) 지원하지 않는 파일 형식입니다.` },
          { status: 400 }
        );
      }

      // 고유한 파일명 생성 (userId_timestamp_random)
      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(2, 15);
      const fileName = `${userId}/${timestamp}_${random}.${fileExt}`;

      // ArrayBuffer로 변환
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Supabase Storage에 업로드
      const { data, error } = await supabaseAdmin.storage
        .from(BUCKET_NAME)
        .upload(fileName, buffer, {
          contentType: file.type,
          upsert: false,
        });

      if (error) {
        console.error("파일 업로드 실패:", error);
        return NextResponse.json({ error: `파일 업로드 실패: ${error.message}` }, { status: 500 });
      }

      // Public URL 생성
      const { data: urlData } = supabaseAdmin.storage.from(BUCKET_NAME).getPublicUrl(data.path);

      uploadedUrls.push(urlData.publicUrl);
      console.log("파일 업로드 성공:", data.path);
    }

    return NextResponse.json({
      success: true,
      urls: uploadedUrls,
    });
  } catch (error) {
    console.error("이미지 업로드 API 에러:", error);
    return NextResponse.json(
      {
        error: "이미지 업로드 중 오류가 발생했습니다.",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
