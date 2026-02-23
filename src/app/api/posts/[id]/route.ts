import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// 投稿の編集 (PUT)
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "ログインが必要です" }, { status: 401 });
        }

        const { id } = await params;

        // 既存の投稿を取得して権限チェック
        const existingPost = await prisma.post.findUnique({
            where: { id },
            select: { authorId: true }
        });

        if (!existingPost) {
            return NextResponse.json({ error: "投稿が見つかりません" }, { status: 404 });
        }

        if (existingPost.authorId !== session.user.id) {
            return NextResponse.json({ error: "編集権限がありません" }, { status: 403 });
        }

        const body = await request.json();
        const { title, description, language, tags, isDraft, files } = body;

        if (!title || !language || !files || files.length === 0) {
            return NextResponse.json({ error: "必須項目が不足しています" }, { status: 400 });
        }

        // 既存のファイルを全削除し、新しいファイルを作り直す方式で更新（シンプル化）
        const updatedPost = await prisma.post.update({
            where: { id },
            data: {
                title,
                description: description || "",
                language,
                tags: tags || [],
                isDraft: isDraft || false,
                files: {
                    deleteMany: {}, // 既存ファイルを全て削除
                    create: files.map((file: { filename: string; content: string; language: string }) => ({
                        filename: file.filename,
                        content: file.content,
                        language: file.language,
                    })),
                },
            },
            include: {
                files: true,
                author: true,
            }
        });

        return NextResponse.json(updatedPost, { status: 200 });
    } catch (error) {
        console.error("投稿更新エラー:", error);
        return NextResponse.json({ error: "投稿の更新に失敗しました" }, { status: 500 });
    }
}

// 投稿の削除 (DELETE)
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "ログインが必要です" }, { status: 401 });
        }

        const { id } = await params;

        // 既存の投稿を取得して権限チェック
        const existingPost = await prisma.post.findUnique({
            where: { id },
            select: { authorId: true }
        });

        if (!existingPost) {
            return NextResponse.json({ error: "投稿が見つかりません" }, { status: 404 });
        }

        if (existingPost.authorId !== session.user.id) {
            return NextResponse.json({ error: "削除権限がありません" }, { status: 403 });
        }

        // 投稿を削除（関連するファイル、いいね、コメント等はスキーマの onDelete: Cascade で自動削除される想定）
        await prisma.post.delete({
            where: { id },
        });

        return NextResponse.json({ message: "投稿を削除しました" }, { status: 200 });
    } catch (error) {
        console.error("投稿削除エラー:", error);
        return NextResponse.json({ error: "投稿の削除に失敗しました" }, { status: 500 });
    }
}
