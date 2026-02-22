"use client";

import { useState } from "react";
import UserAvatar from "@/components/UserAvatar";
import PostCard from "@/components/PostCard";
import { UserProfile, PostCardData } from "@/types/types";
import { FiUsers, FiFileText } from "react-icons/fi";
import { formatRelativeTime } from "@/lib/utils";

interface UserProfileClientProps {
    user: UserProfile;
    posts: PostCardData[];
    currentUserId?: string;
}

export default function UserProfileClient({
    user,
    posts,
    currentUserId,
}: UserProfileClientProps) {
    const [activeTab, setActiveTab] = useState<"posts" | "likes">("posts");
    const [isFollowing, setIsFollowing] = useState(user.isFollowing || false);
    const [followersCount, setFollowersCount] = useState(user._count.followers);
    const [isLoading, setIsLoading] = useState(false);

    const isOwnProfile = currentUserId === user.id;

    const handleFollowToggle = async () => {
        if (!currentUserId) {
            // 未ログイン時はログインを促す処理が必要（ここではモック）
            alert("ログインが必要です");
            return;
        }

        try {
            setIsLoading(true);
            const res = await fetch(`/api/users/${user.id}/follow`, {
                method: "POST",
            });

            if (res.ok) {
                const data = await res.json();
                setIsFollowing(data.isFollowing);
                setFollowersCount(prev => (data.isFollowing ? prev + 1 : prev - 1));
            }
        } catch (error) {
            console.error("フォロー処理に失敗しました", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="main-layout">
            <main className="main-content">
                {/* ユーザープロフィールヘッダー */}
                <div className="profile-header" style={{
                    padding: "var(--space-6)",
                    backgroundColor: "var(--bg-card)",
                    borderRadius: "var(--radius-lg)",
                    border: "1px solid var(--border)",
                    marginBottom: "var(--space-6)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "var(--space-4)"
                }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div style={{ display: "flex", gap: "var(--space-4)", alignItems: "center" }}>
                            <UserAvatar name={user.name} image={user.image} size="lg" />
                            <div>
                                <h1 style={{ fontSize: "var(--text-2xl)", fontWeight: "bold", margin: 0 }}>
                                    {user.name || "名称未設定ユーザー"}
                                </h1>
                                <p style={{ color: "var(--text-muted)", margin: "var(--space-1) 0 0 0", fontSize: "var(--text-sm)" }}>
                                    @{user.id.slice(0, 8)} • 参加日: {formatRelativeTime(user.createdAt)}
                                </p>
                            </div>
                        </div>

                        {/* アクションボタン */}
                        <div>
                            {isOwnProfile ? (
                                <button className="btn btn-secondary">
                                    プロフィールを編集
                                </button>
                            ) : (
                                <button
                                    className={`btn ${isFollowing ? "btn-secondary" : "btn-primary"}`}
                                    onClick={handleFollowToggle}
                                    disabled={isLoading}
                                >
                                    {isFollowing ? "フォロー中" : "フォローする"}
                                </button>
                            )}
                        </div>
                    </div>

                    {/* 自己紹介文 */}
                    {user.bio && (
                        <p style={{ marginTop: "var(--space-2)", lineHeight: 1.5 }}>
                            {user.bio}
                        </p>
                    )}

                    {/* 統計情報 */}
                    <div style={{ display: "flex", gap: "var(--space-4)", marginTop: "var(--space-2)", color: "var(--text-muted)" }}>
                        <span style={{ display: "flex", alignItems: "center", gap: "var(--space-1)" }}>
                            <FiUsers /> <span style={{ fontWeight: "bold", color: "var(--text-main)" }}>{user._count.following}</span> フォロー中
                        </span>
                        <span style={{ display: "flex", alignItems: "center", gap: "var(--space-1)" }}>
                            <FiUsers /> <span style={{ fontWeight: "bold", color: "var(--text-main)" }}>{followersCount}</span> フォロワー
                        </span>
                        <span style={{ display: "flex", alignItems: "center", gap: "var(--space-1)" }}>
                            <FiFileText /> <span style={{ fontWeight: "bold", color: "var(--text-main)" }}>{user._count.posts}</span> 投稿
                        </span>
                    </div>
                </div>

                {/* タブナビゲーション */}
                <div className="tabs" style={{ marginBottom: "var(--space-4)" }}>
                    <button
                        className={`tab ${activeTab === "posts" ? "active" : ""}`}
                        onClick={() => setActiveTab("posts")}
                    >
                        投稿作品 ({posts.length})
                    </button>
                    <button
                        className={`tab ${activeTab === "likes" ? "active" : ""}`}
                        onClick={() => setActiveTab("likes")}
                    >
                        いいねした作品
                    </button>
                </div>

                {/* タブコンテンツ */}
                <div className="tab-content" style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
                    {activeTab === "posts" && (
                        posts.length > 0 ? (
                            posts.map((post) => (
                                <PostCard key={post.id} post={post} />
                            ))
                        ) : (
                            <div className="empty-state">
                                <p className="empty-state-text">まだ投稿がありません</p>
                            </div>
                        )
                    )}

                    {activeTab === "likes" && (
                        <div className="empty-state">
                            <p className="empty-state-text">準備中です</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
