"use client";

import Link from "next/link";
import { FiHeart, FiBookmark, FiMessageSquare, FiEye } from "react-icons/fi";
import { PostCardData } from "@/types/types";
import { formatRelativeTime, truncateText } from "@/lib/utils";
import UserAvatar, { TagBadge, LanguageBadge } from "./UserAvatar";

/**
 * 投稿カードコンポーネント
 * タイムライン上でコード投稿をカード形式で表示
 */
interface PostCardProps {
    post: PostCardData;
}

export default function PostCard({ post }: PostCardProps) {
    const previewCode = post.files[0]?.content || "";
    const previewLines = previewCode.split("\n").slice(0, 8).join("\n");

    return (
        <Link href={`/posts/${post.id}`} className="post-card animate-in">
            {/* ヘッダー: 著者情報 */}
            <div className="post-card-header">
                <div className="post-card-author">
                    <UserAvatar
                        name={post.author.name}
                        image={post.author.image}
                        size="sm"
                    />
                    <span className="post-card-author-name">{post.author.name}</span>
                </div>
                <span className="post-card-time">
                    {formatRelativeTime(post.createdAt)}
                </span>
            </div>

            {/* タイトル */}
            <h3 className="post-card-title">{post.title}</h3>

            {/* 説明文 */}
            {post.description && (
                <p className="post-card-description">
                    {truncateText(post.description, 120)}
                </p>
            )}

            {/* コードプレビュー */}
            <div className="post-card-code-preview">
                <pre>{previewLines}</pre>
            </div>

            {/* メタ情報: タグ・統計 */}
            <div className="post-card-meta">
                <div className="post-card-tags">
                    <LanguageBadge language={post.language} />
                    {post.tags.slice(0, 3).map((tag) => (
                        <TagBadge key={tag} tag={tag} clickable={false} />
                    ))}
                </div>
                <div className="post-card-stats">
                    <span className={`post-card-stat ${post.isLiked ? "liked" : ""}`}>
                        <FiHeart />
                        {post._count.likes}
                    </span>
                    <span
                        className={`post-card-stat ${post.isBookmarked ? "bookmarked" : ""}`}
                    >
                        <FiBookmark />
                        {post._count.bookmarks}
                    </span>
                    <span className="post-card-stat">
                        <FiMessageSquare />
                        {post._count.comments}
                    </span>
                    <span className="post-card-stat">
                        <FiEye />
                        {post.viewCount}
                    </span>
                </div>
            </div>
        </Link>
    );
}
