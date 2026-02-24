import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "ログインが必要です" }, { status: 401 });
        }

        const { id: postId } = await params;
        const userId = session.user.id;

        // 投稿の存在確認
        const post = await prisma.post.findUnique({
            where: { id: postId },
        });

        if (!post) {
            return NextResponse.json({ error: "投稿が見つかりません" }, { status: 404 });
        }

        // 既存のブックマークを確認
        const existingBookmark = await prisma.bookmark.findUnique({
            where: {
                userId_postId: {
                    userId,
                    postId,
                },
            },
        });

        if (existingBookmark) {
            // すでにブックマークしている場合は解除（削除）
            await prisma.bookmark.delete({
                where: {
                    userId_postId: {
                        userId,
                        postId,
                    },
                },
            });
            return NextResponse.json({ isBookmarked: false }, { status: 200 });
        } else {
            // まだブックマークしていない場合は追加
            await prisma.bookmark.create({
                data: {
                    userId,
                    postId,
                },
            });
            return NextResponse.json({ isBookmarked: true }, { status: 200 });
        }
    } catch (error) {
        console.error("ブックマーク処理エラー:", error);
        return NextResponse.json({ error: "処理に失敗しました" }, { status: 500 });
    }
}
