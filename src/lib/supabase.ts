import { createClient } from "@supabase/supabase-js";

// Why: Supabase Storageをプロフィール画像のアップロード先として使用
// 環境変数未設定時はダミー値を使い、クライアント生成エラーを防ぐ

const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
