import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth"; // auth.jsのパスに合わせてください

export async function POST(
    req: NextRequest,
    context: { params: Promise<{ id: string }> } // Promiseで受け取るように修正
) {
    try {
        const session = await auth();
        if (!session || !session.user || !session.user.id) {
            return NextResponse.json(
                { message: "認証が必要です" },
                { status: 401 }
            );
        }

        const currentUserId = session.user.id;
        const { id: targetUserId } = await context.params;

        if (currentUserId === targetUserId) {
            return NextResponse.json(
                { message: "自分自身をフォローすることはできません" },
                { status: 400 }
            );
        }

        // 対象ユーザーの存在確認
        const targetUser = await prisma.user.findUnique({
            where: { id: targetUserId },
        });

        if (!targetUser) {
            return NextResponse.json(
                { message: "ユーザーが見つかりません" },
                { status: 404 }
            );
        }

        // 既存のフォロー関係を確認
        const existingFollow = await prisma.follow.findUnique({
            where: {
                followerId_followingId: {
                    followerId: currentUserId,
                    followingId: targetUserId,
                },
            },
        });

        if (existingFollow) {
            // フォロー解除
            await prisma.follow.delete({
                where: {
                    id: existingFollow.id,
                },
            });
            return NextResponse.json(
                { message: "フォローを解除しました", isFollowing: false },
                { status: 200 }
            );
        } else {
            // フォロー
            await prisma.follow.create({
                data: {
                    followerId: currentUserId,
                    followingId: targetUserId,
                },
            });
            return NextResponse.json(
                { message: "フォローしました", isFollowing: true },
                { status: 200 }
            );
        }
    } catch (error) {
        console.error("フォローAPIエラー:", error);
        return NextResponse.json(
            { message: "サーバーエラーが発生しました" },
            { status: 500 }
        );
    }
}
