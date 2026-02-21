"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
    FiHeart,
    FiBookmark,
    FiShare2,
    FiFlag,
    FiArrowLeft,
} from "react-icons/fi";
import { MOCK_POSTS } from "@/lib/mockData";
import { formatRelativeTime } from "@/lib/utils";
import UserAvatar, { TagBadge, LanguageBadge } from "@/components/UserAvatar";
import { FileTabsViewer } from "@/components/CodeViewer";
import { CommentData } from "@/types/types";

/** モックコメント */
const MOCK_COMMENTS: CommentData[] = [
    {
        id: "c1",
        content:
            "素晴らしいコードですね！Xavier初期化の部分がとても参考になりました。",
        createdAt: "2026-02-18T12:00:00Z",
        user: { id: "user-2", name: "佐藤花子", image: null },
    },
    {
        id: "c2",
        content: "バックプロパゲーションの実装がクリアで分かりやすいです。",
        createdAt: "2026-02-18T14:30:00Z",
        user: { id: "user-3", name: "鈴木一郎", image: null },
    },
];

export default function PostDetailPage() {
    const params = useParams();
    const postId = params.id as string;
    const post = MOCK_POSTS.find((p) => p.id === postId);

    const [isLiked, setIsLiked] = useState(post?.isLiked || false);
    const [isBookmarked, setIsBookmarked] = useState(
        post?.isBookmarked || false
    );
    const [likeCount, setLikeCount] = useState(post?._count.likes || 0);
    const [commentText, setCommentText] = useState("");
    const [comments, setComments] = useState<CommentData[]>(MOCK_COMMENTS);

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
        setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
    };

    const handleBookmark = () => {
        setIsBookmarked(!isBookmarked);
    };

    const handleComment = (e: React.FormEvent) => {
        e.preventDefault();
        if (!commentText.trim()) return;

        const newComment: CommentData = {
            id: `c-new-${Date.now()}`,
            content: commentText,
            createdAt: new Date().toISOString(),
            user: { id: "current-user", name: "ゲストユーザー", image: null },
        };
        setComments([...comments, newComment]);
        setCommentText("");
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
                            {post.tags.map((tag) => (
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
                                        disabled={!commentText.trim()}
                                    >
                                        送信
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

                    {/* 関連コード */}
                    <div style={{ marginTop: "var(--space-8)" }}>
                        <h2
                            style={{
                                fontSize: "var(--text-lg)",
                                fontWeight: 700,
                                marginBottom: "var(--space-4)",
                            }}
                        >
                            🔗 関連するコード
                        </h2>
                        <div className="post-grid">
                            {MOCK_POSTS.filter(
                                (p) =>
                                    p.id !== post.id &&
                                    (p.language === post.language ||
                                        p.tags.some((t) => post.tags.includes(t)))
                            )
                                .slice(0, 3)
                                .map((relatedPost) => (
                                    <Link
                                        key={relatedPost.id}
                                        href={`/posts/${relatedPost.id}`}
                                        className="post-card"
                                        style={{ display: "block" }}
                                    >
                                        <div className="post-card-header">
                                            <div className="post-card-author">
                                                <UserAvatar
                                                    name={relatedPost.author.name}
                                                    image={relatedPost.author.image}
                                                    size="sm"
                                                />
                                                <span className="post-card-author-name">
                                                    {relatedPost.author.name}
                                                </span>
                                            </div>
                                        </div>
                                        <h3 className="post-card-title">{relatedPost.title}</h3>
                                        <div className="post-card-tags">
                                            <LanguageBadge language={relatedPost.language} />
                                            {relatedPost.tags.slice(0, 2).map((tag) => (
                                                <TagBadge key={tag} tag={tag} clickable={false} />
                                            ))}
                                        </div>
                                    </Link>
                                ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
