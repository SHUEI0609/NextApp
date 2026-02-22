// Prisma v7 設定ファイル
// Why: Prisma v7ではdatasourceのURL設定がschema.prismaから分離され、このファイルで管理する

import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
    // スキーマファイルのパス
    schema: "prisma/schema.prisma",

    // マイグレーション設定
    migrations: {
        path: "prisma/migrations",
    },

    // データベース接続URL
    datasource: {
        url: env("DATABASE_URL"),
    },
});
