import { prisma } from "@/lib/prisma";
import PostDetailClient from "./PostDetailClient";
import { notFound } from "next/navigation";

export default async function PostDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    const post = await prisma.post.findUnique({
        where: { id },
        include: {
            author: true,
            files: true,
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
    };

    return <PostDetailClient post={postData} />;
}
