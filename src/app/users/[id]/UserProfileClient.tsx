"use client";

import { useState } from "react";
import UserAvatar from "@/components/UserAvatar";
import PostCard from "@/components/PostCard";
import { UserProfile, PostCardData } from "@/types/types";

import { formatRelativeTime } from "@/lib/utils";

interface UserProfileClientProps {
    user: UserProfile;
    posts: PostCardData[];
    likedPosts: PostCardData[];
    bookmarkedPosts: PostCardData[];
    currentUserId?: string;
}

export default function UserProfileClient({
    user,
    posts,
    likedPosts,
    bookmarkedPosts,
    currentUserId,
}: UserProfileClientProps) {
    const [activeTab, setActiveTab] = useState<"posts" | "likes" | "bookmarks">("posts");
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
                <div className="profile-header">
                    <UserAvatar name={user.name} image={user.image} size="lg" />

                    <div className="profile-info">
                        <h1 className="profile-name">
                            {user.name || "名称未設定ユーザー"}
                        </h1>
                        <p style={{ color: "var(--color-text-tertiary)", fontSize: "var(--text-sm)", marginBottom: "var(--space-3)" }}>
                            @{user.id.slice(0, 8)} • 参加日: {formatRelativeTime(user.createdAt)}
                        </p>

                        {/* 自己紹介文 */}
                        {user.bio && (
                            <p className="profile-bio">
                                {user.bio}
                            </p>
                        )}

                        {/* 統計情報 */}
                        <div className="profile-stats">
                            <div className="profile-stat">
                                <div className="profile-stat-value">{user._count.following}</div>
                                <div className="profile-stat-label">フォロー中</div>
                            </div>
                            <div className="profile-stat">
                                <div className="profile-stat-value">{followersCount}</div>
                                <div className="profile-stat-label">フォロワー</div>
                            </div>
                            <div className="profile-stat">
                                <div className="profile-stat-value">{user._count.posts}</div>
                                <div className="profile-stat-label">投稿</div>
                            </div>
                        </div>
                    </div>

                    {/* アクションボタン */}
                    <div className="profile-actions">
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

                {/* タブナビゲーション */}
                <div className="tabs">
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
                        いいねした作品 ({likedPosts.length})
                    </button>
                    {isOwnProfile && (
                        <button
                            className={`tab ${activeTab === "bookmarks" ? "active" : ""}`}
                            onClick={() => setActiveTab("bookmarks")}
                        >
                            ブックマーク ({bookmarkedPosts.length})
                        </button>
                    )}
                </div>

                {/* タブコンテンツ */}
                <div className="post-grid">
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
                        likedPosts.length > 0 ? (
                            likedPosts.map((post) => (
                                <PostCard key={post.id} post={post} />
                            ))
                        ) : (
                            <div className="empty-state">
                                <p className="empty-state-text">まだいいねした投稿がありません</p>
                            </div>
                        )
                    )}

                    {activeTab === "bookmarks" && isOwnProfile && (
                        bookmarkedPosts.length > 0 ? (
                            bookmarkedPosts.map((post) => (
                                <PostCard key={post.id} post={post} />
                            ))
                        ) : (
                            <div className="empty-state">
                                <p className="empty-state-text">まだブックマークした投稿がありません</p>
                            </div>
                        )
                    )}
                </div>
            </main>
        </div>
    );
}
