import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// 임시 처리: 환경변수가 없어도 진행 (실제 배포 시 제거 필요)
if (
  !supabaseUrl ||
  !supabaseAnonKey ||
  supabaseUrl === "https://temp-project.supabase.co"
) {
  console.warn(
    "⚠️  임시 Supabase 설정을 사용 중입니다. .env.local 파일에 실제 Supabase 정보를 입력해주세요."
  );
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});
