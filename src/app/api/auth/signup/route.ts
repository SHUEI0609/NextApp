// 新規ユーザー登録APIエンドポイント
// Why: Credentials認証にはユーザー登録用の独自APIが必要（NextAuthは登録機能を提供しない）

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

interface SignUpRequestBody {
    name: string;
    email: string;
    password: string;
}

export async function POST(request: Request): Promise<NextResponse> {
    try {
        const body = (await request.json()) as SignUpRequestBody;
        const { name, email, password } = body;

        // バリデーション
        if (!name || !email || !password) {
            return NextResponse.json(
                { error: "すべてのフィールドを入力してください" },
                { status: 400 }
            );
        }

        if (password.length < 8) {
            return NextResponse.json(
                { error: "パスワードは8文字以上で入力してください" },
                { status: 400 }
            );
        }

        // メールアドレスの重複チェック
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { error: "このメールアドレスは既に登録されています" },
                { status: 409 }
            );
        }

        // パスワードをハッシュ化（ソルトラウンド12）
        // Why: bcryptのソルトラウンド12はセキュリティと処理速度のバランスが良い
        const hashedPassword = await bcrypt.hash(password, 12);

        // ユーザー作成
        const user = await prisma.user.create({
            data: {
                name,
                email,
                hashedPassword,
            },
        });

        return NextResponse.json(
            {
                id: user.id,
                name: user.name,
                email: user.email,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("ユーザー登録エラー:", error);
        return NextResponse.json(
            { error: "ユーザー登録に失敗しました" },
            { status: 500 }
        );
    }
}
