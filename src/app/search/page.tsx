"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { FiSearch } from "react-icons/fi";
import {
    SUPPORTED_LANGUAGES,
    LANGUAGE_DISPLAY_NAMES,
} from "@/types/types";
import { MOCK_POSTS, MOCK_TRENDING_TAGS } from "@/lib/mockData";
import PostCard from "@/components/PostCard";

/**
 * 検索ページの内部コンポーネント
 * Why: useSearchParams()はSuspense boundaryでラップする必要がある（Next.js要件）
 */
function SearchContent() {
    const searchParams = useSearchParams();
    const initialQuery = searchParams.get("q") || "";
    const initialTag = searchParams.get("tag") || "";

    const [query, setQuery] = useState(initialQuery);
    const [selectedTag, setSelectedTag] = useState(initialTag);
    const [selectedLanguage, setSelectedLanguage] = useState("");

    // URLパラメータの変更を監視
    useEffect(() => {
        setQuery(searchParams.get("q") || "");
        setSelectedTag(searchParams.get("tag") || "");
    }, [searchParams]);

    // 検索結果のフィルタリング
    const filteredPosts = MOCK_POSTS.filter((post) => {
        if (post.isDraft) return false;

        const matchesQuery =
            !query ||
            post.title.toLowerCase().includes(query.toLowerCase()) ||
            post.description?.toLowerCase().includes(query.toLowerCase()) ||
            post.tags.some((t) =>
                t.toLowerCase().includes(query.toLowerCase())
            );

        const matchesTag =
            !selectedTag ||
            post.tags.some((t) =>
                t.toLowerCase().includes(selectedTag.toLowerCase())
            );

        const matchesLanguage =
            !selectedLanguage || post.language === selectedLanguage;

        return matchesQuery && matchesTag && matchesLanguage;
    });

    return (
        <>
            <h1
                style={{
                    fontSize: "var(--text-2xl)",
                    fontWeight: 800,
                    marginBottom: "var(--space-6)",
                }}
            >
                🔍 コードを検索
            </h1>

            {/* 検索バー */}
            <div className="form-group">
                <div style={{ position: "relative" }}>
                    <FiSearch
                        style={{
                            position: "absolute",
                            left: "14px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            color: "var(--color-text-tertiary)",
                        }}
                    />
                    <input
                        type="text"
                        className="form-input"
                        style={{ paddingLeft: "40px" }}
                        placeholder="キーワードで検索..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* フィルター */}
            <div className="search-filters">
                <select
                    className="form-select"
                    style={{ width: "auto" }}
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                >
                    <option value="">すべての言語</option>
                    {SUPPORTED_LANGUAGES.map((lang) => (
                        <option key={lang} value={lang}>
                            {LANGUAGE_DISPLAY_NAMES[lang]}
                        </option>
                    ))}
                </select>

                {selectedTag && (
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "var(--space-2)",
                        }}
                    >
                        <span
                            style={{
                                fontSize: "var(--text-sm)",
                                color: "var(--color-text-secondary)",
                            }}
                        >
                            タグ:
                        </span>
                        <span className="tag-badge">
                            #{selectedTag}
                            <button
                                onClick={() => setSelectedTag("")}
                                style={{
                                    background: "none",
                                    border: "none",
                                    color: "inherit",
                                    cursor: "pointer",
                                    padding: "0 2px",
                                    fontSize: "var(--text-xs)",
                                }}
                            >
                                ×
                            </button>
                        </span>
                    </div>
                )}
            </div>

            {/* 人気タグ */}
            <div style={{ marginBottom: "var(--space-6)" }}>
                <h3
                    style={{
                        fontSize: "var(--text-sm)",
                        fontWeight: 700,
                        color: "var(--color-text-secondary)",
                        marginBottom: "var(--space-3)",
                    }}
                >
                    人気のタグ
                </h3>
                <div
                    style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "var(--space-2)",
                    }}
                >
                    {MOCK_TRENDING_TAGS.map((tag) => (
                        <button
                            key={tag.name}
                            className={`tag-badge ${selectedTag === tag.name ? "active" : ""}`}
                            onClick={() =>
                                setSelectedTag(
                                    selectedTag === tag.name ? "" : tag.name
                                )
                            }
                            style={
                                selectedTag === tag.name
                                    ? {
                                        background: "var(--color-accent)",
                                        color: "white",
                                    }
                                    : {}
                            }
                        >
                            #{tag.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* 検索結果 */}
            <div style={{ marginBottom: "var(--space-4)" }}>
                <span
                    style={{
                        fontSize: "var(--text-sm)",
                        color: "var(--color-text-secondary)",
                    }}
                >
                    {filteredPosts.length}件の結果
                </span>
            </div>

            <div className="post-grid">
                {filteredPosts.length > 0 ? (
                    filteredPosts.map((post) => (
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
        </>
    );
}

export default function SearchPage() {
    return (
        <div className="main-layout">
            <main className="main-content">
                <div className="search-page">
                    <Suspense
                        fallback={
                            <div className="loading-spinner">
                                <div className="spinner" />
                            </div>
                        }
                    >
                        <SearchContent />
                    </Suspense>
                </div>
            </main>
        </div>
    );
}
