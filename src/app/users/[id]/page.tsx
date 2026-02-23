import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import UserProfileClient from "./UserProfileClient";
import { auth } from "@/lib/auth"; // auth.js の設定に合わせてください

export default async function UserProfilePage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const session = await auth();
    const currentUserId = session?.user?.id;

    // ユーザー情報と投稿一覧の取得
    const user = await prisma.user.findUnique({
        where: { id },
        include: {
            _count: {
                select: {
                    followers: true,
                    following: true,
                    posts: true,
                },
            },
        },
    });

    if (!user) {
        notFound();
    }

    // ユーザーの投稿一覧（最新順）
    const posts = await prisma.post.findMany({
        where: { authorId: id },
        orderBy: { createdAt: "desc" },
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

    // ユーザーがいいねした投稿一覧
    const likedPostsQuery = await prisma.like.findMany({
        where: { userId: id },
        orderBy: { createdAt: "desc" },
        include: {
            post: {
                include: {
                    author: true,
                    files: true,
                    _count: {
                        select: { likes: true, comments: true, bookmarks: true },
                    },
                },
            },
        },
    });
    const likedPosts = likedPostsQuery.map((like) => like.post);

    // ユーザーがブックマークした投稿一覧
    const bookmarkedPostsQuery = await prisma.bookmark.findMany({
        where: { userId: id },
        orderBy: { createdAt: "desc" },
        include: {
            post: {
                include: {
                    author: true,
                    files: true,
                    _count: {
                        select: { likes: true, comments: true, bookmarks: true },
                    },
                },
            },
        },
    });
    const bookmarkedPosts = bookmarkedPostsQuery.map((bookmark) => bookmark.post);

    type RawPost = {
        createdAt: Date;
        updatedAt: Date;
        viewCount?: number;
        _count: {
            likes: number;
            comments: number;
            bookmarks: number;
        };
        authorId?: string | null;
        author?: {
            id: string;
            name: string | null;
            image: string | null;
        } | null;
        files?: {
            id: string;
            filename: string;
            content: string;
            language: string;
        }[];
    };

    // クライアントコンポーネントに渡すためのデータ整形
    const sanitizePostData = <T extends RawPost>(postList: T[]) => postList.map((post: T) => ({
        ...post,
        createdAt: post.createdAt.toISOString(),
        updatedAt: post.updatedAt.toISOString(),
        isLiked: false,
        isBookmarked: false,
        viewCount: post.viewCount || 0,
        _count: {
            likes: post._count.likes,
            comments: post._count.comments,
            bookmarks: post._count.bookmarks,
        },
        author: {
            id: post.authorId || post.author?.id,
            name: post.author?.name || "Unknown",
            image: post.author?.image || null,
        },
        files: post.files?.map((f) => ({
            id: f.id,
            filename: f.filename,
            content: f.content,
            language: f.language,
        })) || [],
    }));

    const postsData = sanitizePostData(posts);
    const formattedLikedPosts = sanitizePostData(likedPosts);
    const formattedBookmarkedPosts = sanitizePostData(bookmarkedPosts);

    // 現在のユーザーがこのユーザーをフォローしているかどうかの判定
    let isFollowing = false;
    if (currentUserId && currentUserId !== id) {
        const follow = await prisma.follow.findUnique({
            where: {
                followerId_followingId: {
                    followerId: currentUserId,
                    followingId: id,
                },
            },
        });
        isFollowing = !!follow;
    }

    const userData = {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        bio: user.bio,
        createdAt: user.createdAt.toISOString(),
        _count: user._count,
        isFollowing,
    };

    return (
        <UserProfileClient
            user={userData}
            posts={postsData}
            likedPosts={formattedLikedPosts}
            bookmarkedPosts={formattedBookmarkedPosts}
            currentUserId={currentUserId}
        />
    );
}
