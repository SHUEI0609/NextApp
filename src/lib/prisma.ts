// Prismaクライアントのシングルトンインスタンス
// Why: 開発環境でのホットリロード時にPrismaClientが重複生成されるのを防ぐ

import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Why: Prisma v7 ではエンジンタイプ "client" で adapter か accelerateUrl が必須
// @prisma/adapter-pg と pg Pool を使用して PostgreSQL に接続する
function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL 環境変数が設定されていません");
  }

  // Why: self-signed certificate エラーを回避するため rejectUnauthorized: false を指定
  const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
