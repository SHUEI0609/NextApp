import Sidebar from "@/components/Sidebar";
import PostCard from "@/components/PostCard";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { calculateTrendScore } from "@/lib/utils";
import { auth } from "@/lib/auth";

export const revalidate = 0;
export const dynamic = "force-dynamic";

/**
 * トップページ - タイムライン
 * クエリパラメータ (?tab=trend|latest) でタブを切り替えるサーバーコンポーネント
 */
export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = await searchParams;
  const activeTab = (resolvedSearchParams.tab as string) || "trend";

  const session = await auth();
  const currentUserId = session?.user?.id;

  // 1. Where句の構築
  const whereClause: import("@/generated/prisma/client").Prisma.PostWhereInput = { isDraft: false };

  // 未ログインでフォロー中タブを開いた場合は投稿を取得しない
  const skipFetch = activeTab === "following" && !currentUserId;

  if (activeTab === "following" && currentUserId) {
    const following = await prisma.follow.findMany({
      where: { followerId: currentUserId },
      select: { followingId: true },
    });
    const followingIds = following.map((f) => f.followingId);
    whereClause.authorId = { in: followingIds };
  }

  // DBから投稿を取得
  const posts = skipFetch ? [] : await prisma.post.findMany({
    where: whereClause,
    include: {
      author: true,
      files: true,
      _count: {
        select: { likes: true, comments: true, bookmarks: true },
      },
    },
    orderBy: { createdAt: "desc" }, // 基本は降順で取得
    take: activeTab === "trend" ? 200 : 50,
  });

  // いいねとブックマーク状態の取得
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

  // タブに応じたソートとデータ加工
  let displayPosts = [...posts];

  if (activeTab === "trend") {
    displayPosts.sort(
      (a, b) =>
        calculateTrendScore(b._count.likes, b.createdAt.toISOString()) -
        calculateTrendScore(a._count.likes, a.createdAt.toISOString())
    );
    displayPosts = displayPosts.slice(0, 50);
  }

  const sanitizedPosts = displayPosts.map(post => ({
    ...post,
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
    isLiked: userLikes.has(post.id),
    isBookmarked: userBookmarks.has(post.id),
    viewCount: post.viewCount || 0,
    _count: {
      likes: post._count.likes,
      comments: post._count.comments,
      bookmarks: post._count.bookmarks || 0,
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
        <div className="main-content-centered">
          {/* タブ */}
          <div className="tabs">
            <Link
              href="/?tab=trend"
              className={`tab ${activeTab === "trend" ? "active" : ""}`}
              style={{ textDecoration: "none" }}
            >
              🔥 トレンド
            </Link>
            <Link
              href="/?tab=latest"
              className={`tab ${activeTab === "latest" ? "active" : ""}`}
              style={{ textDecoration: "none" }}
            >
              ✨ 新着
            </Link>
            <Link
              href="/?tab=following"
              className={`tab ${activeTab === "following" ? "active" : ""}`}
              style={{ textDecoration: "none" }}
            >
              👥 フォロー中
            </Link>
          </div>

          {/* 投稿一覧 */}
          <div className="post-grid">
            {sanitizedPosts.length > 0 ? (
              sanitizedPosts.map((postData) => {
                return <PostCard key={postData.id} post={postData} />;
              })
            ) : (
              <div className="empty-state">
                <div className="empty-state-icon">📭</div>
                <p className="empty-state-text">投稿がありません</p>
                <p className="empty-state-description">
                  {activeTab === "following"
                    ? "フォローしているユーザーの投稿がここに表示されます"
                    : "最初の投稿を作成してみましょう"}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Sidebar />
    </div>
  );
}
