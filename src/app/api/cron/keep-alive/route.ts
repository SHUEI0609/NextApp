import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// サーバサイドキャッシュを無効化（Vercel デプロイ時のキャッシュ問題を回避）
export const revalidate = 0;
export const dynamic = "force-dynamic";

// Vercel Cron などの定期実行（Cronジョブ）から呼び出されるエンドポイント
export async function GET() {
    try {
        // パフォーマンスに影響しない最も軽量なクエリでDBにアクセス
        await prisma.$queryRaw`SELECT 1`;

        return NextResponse.json(
            { status: "ok", message: "Supabase connection verified" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Keep-alive ping failed:", error);
        return NextResponse.json(
            { status: "error", message: "Failed to connect to database" },
            { status: 500 }
        );
    }
}
