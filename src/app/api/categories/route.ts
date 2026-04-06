import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { CATEGORIES } from "@/lib/constants/categories";

export async function GET() {
  try {
    const supabase = supabaseAdmin;

    // DB에서 카테고리별 상품 수를 동적으로 조회
    const { data, error } = (await supabase.from("products").select("category")) as {
      data: { category: string | null }[] | null;
      error: any;
    };

    if (error) {
      console.error("Categories count error:", error);
      return NextResponse.json({ error: "카테고리 조회 중 오류가 발생했습니다" }, { status: 500 });
    }

    // 카테고리별 카운트 집계
    const countMap: Record<string, number> = {};
    for (const row of data || []) {
      if (row.category) {
        countMap[row.category] = (countMap[row.category] || 0) + 1;
      }
    }

    // CATEGORIES 상수 기준으로 라벨 매핑, 없으면 slug 그대로 사용
    const categoriesWithCount = Object.entries(countMap).map(([slug, count]) => {
      const info = CATEGORIES.find((cat) => cat.slug === slug);
      return {
        id: slug,
        name: info?.label || slug,
        slug,
        count,
      };
    });

    // CATEGORIES 순서대로 정렬 (정의된 카테고리 먼저, 나머지는 뒤에)
    categoriesWithCount.sort((a, b) => {
      const aIndex = CATEGORIES.findIndex((cat) => cat.slug === a.slug);
      const bIndex = CATEGORIES.findIndex((cat) => cat.slug === b.slug);
      if (aIndex === -1 && bIndex === -1) return a.slug.localeCompare(b.slug);
      if (aIndex === -1) return 1;
      if (bIndex === -1) return -1;
      return aIndex - bIndex;
    });

    return NextResponse.json(categoriesWithCount);
  } catch (error) {
    console.error("Categories API error:", error);
    return NextResponse.json({ error: "카테고리 조회 중 오류가 발생했습니다" }, { status: 500 });
  }
}
