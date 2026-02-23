import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import PostCard from "@/components/PostCard";
import SearchForm from "@/components/SearchForm";
import { Prisma } from "@/generated/prisma/client";
import { auth } from "@/lib/auth";

// Vercel キャッシュ対策
export const revalidate = 0;
export const dynamic = "force-dynamic";

export default async function SearchPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const resolvedParams = await searchParams;
    const query = typeof resolvedParams.q === "string" ? resolvedParams.q : "";
    const tag = typeof resolvedParams.tag === "string" ? resolvedParams.tag : "";
    const lang = typeof resolvedParams.lang === "string" ? resolvedParams.lang : "";

    const session = await auth();
    const currentUserId = session?.user?.id;

    // Prisma 検索条件構築
    const whereClause: Prisma.PostWhereInput = {
        isDraft: false,
    };

    const AND: Prisma.PostWhereInput[] = [];

    if (query) {
        AND.push({
            OR: [
                { title: { contains: query, mode: "insensitive" } },
                { description: { contains: query, mode: "insensitive" } },
            ],
        });
    }

    if (tag) {
        AND.push({
            tags: { has: tag },
        });
    }

    if (lang) {
        AND.push({
            language: lang,
        });
    }

    if (AND.length > 0) {
        whereClause.AND = AND;
    }

    const posts = await prisma.post.findMany({
        where: whereClause,
        orderBy: { createdAt: "desc" },
        include: {
            author: true,
            files: true,
            _count: {
                select: { likes: true, comments: true, bookmarks: true },
            },
        },
    });

    // 各投稿に対して、ログインユーザーがいいね・ブックマークしているか取得する処理
    let userLikes = new Set<string>();
    let userBookmarks = new Set<string>();

    if (currentUserId && posts.length > 0) {
        const postIds = posts.map(p => p.id);
        const [likes, bookmarks] = await Promise.all([
            prisma.like.findMany({
                where: { userId: currentUserId, postId: { in: postIds } },
                select: { postId: true }
            }),
            prisma.bookmark.findMany({
                where: { userId: currentUserId, postId: { in: postIds } },
                select: { postId: true }
            })
        ]);

        userLikes = new Set(likes.map(l => l.postId));
        userBookmarks = new Set(bookmarks.map(b => b.postId));
    }

    // クライアントコンポーネント（PostCard）に渡す形式に変換
    const sanitizedPosts = posts.map(post => ({
        ...post,
        createdAt: post.createdAt.toISOString(),
        updatedAt: post.updatedAt.toISOString(),
        isLiked: userLikes.has(post.id),
        isBookmarked: userBookmarks.has(post.id),
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
    })) as unknown as import("@/types/types").PostCardData[];

    return (
        <div className="main-layout">
            <main className="main-content">
                <div className="search-page">
                    <h1
                        style={{
                            fontSize: "var(--text-2xl)",
                            fontWeight: 800,
                            marginBottom: "var(--space-6)",
                        }}
                    >
                        🔍 コードを検索
                    </h1>

                    <Suspense fallback={<div>Loading form...</div>}>
                        <SearchForm />
                    </Suspense>

                    {/* 検索結果 */}
                    <div style={{ marginBottom: "var(--space-4)" }}>
                        <span
                            style={{
                                fontSize: "var(--text-sm)",
                                color: "var(--color-text-secondary)",
                            }}
                        >
                            {sanitizedPosts.length}件の結果
                        </span>
                    </div>

                    <div className="post-grid">
                        {sanitizedPosts.length > 0 ? (
                            sanitizedPosts.map((post) => (
                                <PostCard key={post.id} post={post} />
                            ))
                        ) : (
                            <div className="empty-state">
                                <div className="empty-state-icon">🔍</div>
                                <p className="empty-state-text">
                                    該当するコードが見つかりません
                                </p>
                                <p className="empty-state-description">
                                    検索条件を変更してみてください
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
