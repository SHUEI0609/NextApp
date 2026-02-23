import { prisma } from "@/lib/prisma";
import PostDetailClient from "./PostDetailClient";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function PostDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const session = await auth();
    const currentUserId = session?.user?.id;

    const post = await prisma.post.findUnique({
        where: { id },
        include: {
            author: true,
            files: true,
            comments: {
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            image: true,
                        }
                    }
                },
                orderBy: {
                    createdAt: "asc"
                }
            },
            _count: {
                select: {
                    likes: true,
                    comments: true,
                    bookmarks: true,
                },
            },
        },
    });

    if (!post) {
        notFound();
    }

    // クライアントコンポーネントに渡すためのデータ整形（ビュー数など不足分を補完）
    const postData = {
        ...post,
        createdAt: post.createdAt.toISOString(),
        updatedAt: post.updatedAt.toISOString(),
        isLiked: false, // TODO: ログインユーザーのいいね状態
        isBookmarked: false, // TODO: ブックマーク状態
        viewCount: 0, // TODO: 閲覧数
        _count: {
            likes: post._count.likes,
            comments: post._count.comments,
            bookmarks: post._count.bookmarks,
        },
        author: {
            id: post.author.id,
            name: post.author.name,
            image: post.author.image,
        },
        files: post.files.map(f => ({
            id: f.id,
            filename: f.filename,
            content: f.content,
            language: f.language,
        })),
        comments: post.comments.map(c => ({
            id: c.id,
            content: c.content,
            createdAt: c.createdAt.toISOString(),
            user: {
                id: c.user.id,
                name: c.user.name,
                image: c.user.image,
            }
        })),
    };

    return <PostDetailClient post={postData} currentUserId={currentUserId} />;
}
