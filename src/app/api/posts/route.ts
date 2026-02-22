import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "ログインが必要です" },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { title, description, language, tags, isDraft, files } = body;

        if (!title || !language || !files || files.length === 0) {
            return NextResponse.json(
                { error: "必須項目が不足しています" },
                { status: 400 }
            );
        }

        // 投稿とファイルをトランザクションで保存
        const post = await prisma.post.create({
            data: {
                title,
                description: description || "",
                language,
                tags: tags || [],
                isDraft: isDraft || false,
                authorId: session.user.id,
                files: {
                    create: files.map((file: { filename: string; content: string; language: string }) => ({
                        filename: file.filename,
                        content: file.content,
                        language: file.language,
                    })),
                },
            },
        });

        return NextResponse.json(post, { status: 201 });
    } catch (error) {
        console.error("投稿保存エラー:", error);
        return NextResponse.json(
            { error: "投稿の保存に失敗しました" },
            { status: 500 }
        );
    }
}
