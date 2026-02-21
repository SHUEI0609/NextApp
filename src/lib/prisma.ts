// Prismaクライアントのシングルトンインスタンス
// Why: 開発環境でのホットリロード時にPrismaClientが重複生成されるのを防ぐ
// 注意: DB接続設定後に `npx prisma generate` を実行してからインポートを有効化してください

// DB未接続の状態でもビルドが通るよう、ダミーオブジェクトをエクスポート
// Prisma Client生成後（npx prisma generate実行後）は以下のコメントアウトを解除してください

/*
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
*/

// 暫定的なダミーエクスポート（DB接続設定前用）
export const prisma = null;
