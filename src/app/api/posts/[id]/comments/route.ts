import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (!session || !session.user || !session.user.id) {
            return NextResponse.json(
                { message: "ログインが必要です" },
                { status: 401 }
            );
        }

        const { id: postId } = await context.params;
        const body = await req.json();
        const { content } = body;

        if (!content || typeof content !== "string" || content.trim() === "") {
            return NextResponse.json(
                { message: "コメント内容が必要です" },
                { status: 400 }
            );
        }

        // コメントを作成
        const comment = await prisma.comment.create({
            data: {
                content: content.trim(),
                userId: session.user.id,
                postId: postId,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                    },
                },
            },
        });

        // createdAtを文字列に変換して返す
        return NextResponse.json({
            ...comment,
            createdAt: comment.createdAt.toISOString(),
            updatedAt: comment.updatedAt.toISOString(),
        }, { status: 201 });

    } catch (error) {
        console.error("コメント投稿エラー:", error);
        return NextResponse.json(
            { message: "サーバーエラーが発生しました" },
            { status: 500 }
        );
    }
}
