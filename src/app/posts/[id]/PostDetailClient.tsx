"use client";

import { useState } from "react";
import Link from "next/link";
import {
    FiHeart,
    FiBookmark,
    FiShare2,
    FiFlag,
    FiArrowLeft,
} from "react-icons/fi";
import { formatRelativeTime } from "@/lib/utils";
import UserAvatar, { TagBadge, LanguageBadge } from "@/components/UserAvatar";
import { FileTabsViewer } from "@/components/CodeViewer";
import { CommentData, PostCardData } from "@/types/types";
import toast from "react-hot-toast";

export default function PostDetailClient({ post }: { post: PostCardData | null }) {
    const [isLiked, setIsLiked] = useState(post?.isLiked || false);
    const [isBookmarked, setIsBookmarked] = useState(
        post?.isBookmarked || false
    );
    const [likeCount, setLikeCount] = useState(post?._count?.likes || 0);
    const [commentText, setCommentText] = useState("");
    const [comments, setComments] = useState<CommentData[]>(post?.comments || []);
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!post) {
        return (
            <div className="main-layout">
                <main className="main-content">
                    <div className="empty-state">
                        <div className="empty-state-icon">🔍</div>
                        <p className="empty-state-text">投稿が見つかりません</p>
                        <Link href="/" className="btn btn-primary" style={{ marginTop: "var(--space-4)" }}>
                            ホームに戻る
                        </Link>
                    </div>
                </main>
            </div>
        );
    }

    const handleLike = () => {
        setIsLiked(!isLiked);
        setLikeCount((prev: number) => (isLiked ? prev - 1 : prev + 1));
    };

    const handleBookmark = () => {
        setIsBookmarked(!isBookmarked);
    };

    const handleComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!commentText.trim() || isSubmitting) return;

        setIsSubmitting(true);
        try {
            const res = await fetch(`/api/posts/${post.id}/comments`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ content: commentText }),
            });

            if (!res.ok) {
                const data = await res.json();
                if (res.status === 401) {
                    toast.error("コメントするにはログインが必要です");
                } else {
                    toast.error(data.message || "コメントの送信に失敗しました");
                }
                return;
            }

            const newComment = await res.json();
            setComments([...comments, newComment]);
            setCommentText("");
            toast.success("コメントを投稿しました");
        } catch (error) {
            console.error("コメント送信エラー:", error);
            toast.error("サーバーとの通信に失敗しました");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="main-layout">
            <main className="main-content">
                <div className="post-detail">
                    {/* 戻るボタン */}
                    <Link
                        href="/"
                        className="btn btn-ghost"
                        style={{ marginBottom: "var(--space-4)" }}
                    >
                        <FiArrowLeft /> ホームに戻る
                    </Link>

                    {/* ヘッダー */}
                    <div className="post-detail-header">
                        <h1 className="post-detail-title">{post.title}</h1>

                        <div className="post-detail-meta">
                            <Link
                                href={`/users/${post.author.id}`}
                                className="post-detail-author"
                                style={{ textDecoration: "none", color: "inherit" }}
                            >
                                <UserAvatar
                                    name={post.author.name}
                                    image={post.author.image}
                                />
                                <div className="post-detail-author-info">
                                    <span className="post-detail-author-name">
                                        {post.author.name}
                                    </span>
                                    <span className="post-detail-date">
                                        {formatRelativeTime(post.createdAt)} · 閲覧{" "}
                                        {post.viewCount.toLocaleString()}回
                                    </span>
                                </div>
                            </Link>

                            <div className="post-detail-actions">
                                <button
                                    className={`btn ${isLiked ? "btn-danger" : "btn-secondary"}`}
                                    onClick={handleLike}
                                >
                                    <FiHeart style={{ fill: isLiked ? "currentColor" : "none" }} />
                                    {likeCount}
                                </button>
                                <button
                                    className={`btn ${isBookmarked ? "btn-primary" : "btn-secondary"}`}
                                    onClick={handleBookmark}
                                >
                                    <FiBookmark
                                        style={{ fill: isBookmarked ? "currentColor" : "none" }}
                                    />
                                    {isBookmarked ? "保存済み" : "ブックマーク"}
                                </button>
                                <button className="btn btn-ghost btn-icon">
                                    <FiShare2 />
                                </button>
                                <button className="btn btn-ghost btn-icon">
                                    <FiFlag />
                                </button>
                            </div>
                        </div>

                        {/* タグ */}
                        <div
                            style={{
                                display: "flex",
                                gap: "var(--space-2)",
                                flexWrap: "wrap",
                            }}
                        >
                            <LanguageBadge language={post.language} />
                            {post.tags.map((tag: string) => (
                                <TagBadge key={tag} tag={tag} />
                            ))}
                        </div>
                    </div>

                    {/* 説明文 */}
                    {post.description && (
                        <p className="post-detail-description">{post.description}</p>
                    )}

                    {/* コードビューア */}
                    <FileTabsViewer files={post.files} />

                    {/* コメントセクション */}
                    <div className="comments-section">
                        <h2 className="comments-title">
                            💬 コメント ({comments.length})
                        </h2>

                        {/* コメントフォーム */}
                        <form className="comment-form" onSubmit={handleComment}>
                            <UserAvatar name="ゲストユーザー" image={null} />
                            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
                                <textarea
                                    placeholder="コメントを書く..."
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                />
                                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                                    <button
                                        type="submit"
                                        className="btn btn-primary btn-sm"
                                        disabled={!commentText.trim() || isSubmitting}
                                    >
                                        {isSubmitting ? "送信中..." : "送信"}
                                    </button>
                                </div>
                            </div>
                        </form>

                        {/* コメント一覧 */}
                        {comments.map((comment) => (
                            <div key={comment.id} className="comment-item">
                                <UserAvatar
                                    name={comment.user.name}
                                    image={comment.user.image}
                                    size="sm"
                                />
                                <div className="comment-content">
                                    <div className="comment-header">
                                        <span className="comment-author">
                                            {comment.user.name}
                                        </span>
                                        <span className="comment-time">
                                            {formatRelativeTime(comment.createdAt)}
                                        </span>
                                    </div>
                                    <p className="comment-text">{comment.content}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </main>
        </div>
    );
}
