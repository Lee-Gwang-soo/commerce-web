import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { CATEGORIES } from "@/lib/constants/categories";

export async function GET() {
  try {
    const supabase = supabaseAdmin;

    // 각 카테고리별 상품 수 조회
    const categoriesWithCount = await Promise.all(
      CATEGORIES.map(async (category) => {
        const { count, error: countError } = await supabase
          .from("products")
          .select("*", { count: "exact", head: true })
          .eq("category", category.slug);

        if (countError) {
          console.error(`Count error for category ${category.slug}:`, countError);
          return {
            id: category.slug,
            name: category.label,
            slug: category.slug,
            count: 0,
          };
        }

        return {
          id: category.slug,
          name: category.label,
          slug: category.slug,
          count: count || 0,
        };
      })
    );

    return NextResponse.json(categoriesWithCount);
  } catch (error) {
    console.error("Categories API error:", error);
    return NextResponse.json({ error: "카테고리 조회 중 오류가 발생했습니다" }, { status: 500 });
  }
}
