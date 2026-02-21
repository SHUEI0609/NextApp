"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { FiUserPlus, FiUserCheck, FiArrowLeft } from "react-icons/fi";
import { MOCK_USERS, MOCK_POSTS } from "@/lib/mockData";
import UserAvatar from "@/components/UserAvatar";
import PostCard from "@/components/PostCard";

/**
 * ユーザープロフィールページ
 * ユーザー情報、フォロー/フォロワー数、投稿一覧を表示
 */
export default function UserProfilePage() {
    const params = useParams();
    const userId = params.id as string;
    const user = MOCK_USERS.find((u) => u.id === userId);
    const userPosts = MOCK_POSTS.filter((p) => p.author.id === userId);
    const [isFollowing, setIsFollowing] = useState(false);
    const [activeTab, setActiveTab] = useState<"posts" | "likes" | "bookmarks">(
        "posts"
    );

    if (!user) {
        return (
            <div className="main-layout">
                <main className="main-content">
                    <div className="empty-state">
                        <div className="empty-state-icon">🔍</div>
                        <p className="empty-state-text">ユーザーが見つかりません</p>
                        <Link href="/" className="btn btn-primary" style={{ marginTop: "var(--space-4)" }}>
                            ホームに戻る
                        </Link>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="main-layout">
            <main className="main-content">
                <div className="main-content-centered">
                    {/* 戻るボタン */}
                    <Link
                        href="/"
                        className="btn btn-ghost"
                        style={{ marginBottom: "var(--space-4)" }}
                    >
                        <FiArrowLeft /> ホームに戻る
                    </Link>

                    {/* プロフィールヘッダー */}
                    <div className="profile-header">
                        <UserAvatar
                            name={user.name}
                            image={user.image}
                            size="xl"
                        />
                        <div className="profile-info">
                            <h1 className="profile-name">{user.name}</h1>
                            {user.bio && <p className="profile-bio">{user.bio}</p>}

                            <div className="profile-stats">
                                <div className="profile-stat">
                                    <div className="profile-stat-value">
                                        {user._count.posts}
                                    </div>
                                    <div className="profile-stat-label">投稿</div>
                                </div>
                                <div className="profile-stat">
                                    <div className="profile-stat-value">
                                        {user._count.followers}
                                    </div>
                                    <div className="profile-stat-label">フォロワー</div>
                                </div>
                                <div className="profile-stat">
                                    <div className="profile-stat-value">
                                        {user._count.following}
                                    </div>
                                    <div className="profile-stat-label">フォロー中</div>
                                </div>
                            </div>

                            <div style={{ marginTop: "var(--space-4)" }}>
                                <button
                                    className={`btn ${isFollowing ? "btn-secondary" : "btn-primary"}`}
                                    onClick={() => setIsFollowing(!isFollowing)}
                                >
                                    {isFollowing ? (
                                        <>
                                            <FiUserCheck /> フォロー中
                                        </>
                                    ) : (
                                        <>
                                            <FiUserPlus /> フォローする
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* タブ */}
                    <div className="tabs">
                        <button
                            className={`tab ${activeTab === "posts" ? "active" : ""}`}
                            onClick={() => setActiveTab("posts")}
                        >
                            📝 投稿 ({userPosts.length})
                        </button>
                        <button
                            className={`tab ${activeTab === "likes" ? "active" : ""}`}
                            onClick={() => setActiveTab("likes")}
                        >
                            ❤️ いいね
                        </button>
                        <button
                            className={`tab ${activeTab === "bookmarks" ? "active" : ""}`}
                            onClick={() => setActiveTab("bookmarks")}
                        >
                            🔖 ブックマーク
                        </button>
                    </div>

                    {/* 投稿一覧 */}
                    <div className="post-grid">
                        {activeTab === "posts" && userPosts.length > 0 ? (
                            userPosts.map((post) => (
                                <PostCard key={post.id} post={post} />
                            ))
                        ) : activeTab === "posts" ? (
                            <div className="empty-state">
                                <div className="empty-state-icon">📭</div>
                                <p className="empty-state-text">まだ投稿がありません</p>
                            </div>
                        ) : (
                            <div className="empty-state">
                                <div className="empty-state-icon">🔒</div>
                                <p className="empty-state-text">非公開</p>
                                <p className="empty-state-description">
                                    この情報はログインユーザーのみ表示されます
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
