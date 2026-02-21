"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import PostCard from "@/components/PostCard";
import { MOCK_POSTS } from "@/lib/mockData";
import { calculateTrendScore } from "@/lib/utils";

/**
 * トップページ - タイムライン
 * 「トレンド」「新着」「フォロー中」のタブ切り替え
 */
export default function HomePage() {
  const [activeTab, setActiveTab] = useState<"trend" | "latest" | "following">(
    "trend"
  );

  // 表示する投稿を取得（タブに応じてソート）
  const getDisplayPosts = () => {
    const publicPosts = MOCK_POSTS.filter((p) => !p.isDraft);

    switch (activeTab) {
      case "trend":
        // トレンドスコアで降順ソート
        return [...publicPosts].sort(
          (a, b) =>
            calculateTrendScore(b._count.likes, b.createdAt) -
            calculateTrendScore(a._count.likes, a.createdAt)
        );
      case "latest":
        // 新着順
        return [...publicPosts].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case "following":
        // フォロー中（モックではフィルタリングを省略）
        return publicPosts.slice(0, 3);
      default:
        return publicPosts;
    }
  };

  const displayPosts = getDisplayPosts();

  return (
    <div className="main-layout">
      <main className="main-content">
        <div className="main-content-centered">
          {/* ヒーローセクション */}
          <div
            style={{
              textAlign: "center",
              padding: "var(--space-8) 0 var(--space-6)",
            }}
          >
            <h1
              style={{
                fontSize: "var(--text-3xl)",
                fontWeight: 800,
                marginBottom: "var(--space-2)",
                background:
                  "linear-gradient(135deg, #0096fa, #0078d4, #00b4d8)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              コードで世界を変えよう
            </h1>
            <p
              style={{
                color: "var(--color-text-secondary)",
                fontSize: "var(--text-base)",
              }}
            >
              エンジニアのためのコード共有プラットフォーム
            </p>
          </div>

          {/* タブ */}
          <div className="tabs">
            <button
              className={`tab ${activeTab === "trend" ? "active" : ""}`}
              onClick={() => setActiveTab("trend")}
            >
              🔥 トレンド
            </button>
            <button
              className={`tab ${activeTab === "latest" ? "active" : ""}`}
              onClick={() => setActiveTab("latest")}
            >
              ✨ 新着
            </button>
            <button
              className={`tab ${activeTab === "following" ? "active" : ""}`}
              onClick={() => setActiveTab("following")}
            >
              👥 フォロー中
            </button>
          </div>

          {/* 投稿一覧 */}
          <div className="post-grid">
            {displayPosts.length > 0 ? (
              displayPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))
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
