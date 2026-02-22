import Sidebar from "@/components/Sidebar";
import PostCard from "@/components/PostCard";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { calculateTrendScore } from "@/lib/utils";

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

  // DBから投稿を取得
  const posts = await prisma.post.findMany({
    where: { isDraft: false },
    include: {
      author: true,
      files: true,
      likes: true,
      _count: {
        select: { likes: true, comments: true },
      },
    },
    orderBy: { createdAt: "desc" }, // 基本は降順で取得
    take: 50,
  });

  // タブに応じたソートとフィルタリング
  let displayPosts = [...posts];

  if (activeTab === "trend") {
    displayPosts.sort(
      (a, b) =>
        calculateTrendScore(b._count.likes, b.createdAt.toISOString()) -
        calculateTrendScore(a._count.likes, a.createdAt.toISOString())
    );
  } else if (activeTab === "latest") {
    // 取得時に既に降順ソート済み
  } else if (activeTab === "following") {
    // TODO: フォロー機能実装後に修正
    displayPosts = posts.slice(0, 3);
  }

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
            {displayPosts.length > 0 ? (
              displayPosts.map((post) => {
                // PostCardData型に合わせるための変換
                const postCardData = {
                  ...post,
                  isLiked: false, // TODO: ログインユーザーの「いいね」状態
                  isBookmarked: false, // TODO: ログインユーザーの「ブックマーク」状態
                  viewCount: 0, // TODO: 閲覧数機能
                  _count: {
                    likes: post._count.likes,
                    comments: post._count.comments,
                    bookmarks: 0, // TODO: ブックマーク数
                  },
                } as unknown as import("@/types/types").PostCardData;

                return <PostCard key={post.id} post={postCardData} />;
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
