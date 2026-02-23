"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FiSearch } from "react-icons/fi";
import { SUPPORTED_LANGUAGES, LANGUAGE_DISPLAY_NAMES } from "@/types/types";

// Trending tags could be fetched or mocked
import { MOCK_TRENDING_TAGS } from "@/lib/mockData";

export default function SearchForm() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [query, setQuery] = useState(searchParams.get("q") || "");
    const [selectedLanguage, setSelectedLanguage] = useState(searchParams.get("lang") || "");
    const [selectedTag, setSelectedTag] = useState(searchParams.get("tag") || "");

    const handleSubmit = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        const params = new URLSearchParams();
        if (query) params.set("q", query);
        if (selectedLanguage) params.set("lang", selectedLanguage);
        if (selectedTag) params.set("tag", selectedTag);

        router.push(`/search?${params.toString()}`);
    };

    const handleTagClick = (tag: string) => {
        const newTag = selectedTag === tag ? "" : tag;
        setSelectedTag(newTag);

        const params = new URLSearchParams();
        if (query) params.set("q", query);
        if (selectedLanguage) params.set("lang", selectedLanguage);
        if (newTag) params.set("tag", newTag);
        router.push(`/search?${params.toString()}`);
    };

    const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const lang = e.target.value;
        setSelectedLanguage(lang);
        const params = new URLSearchParams();
        if (query) params.set("q", query);
        if (lang) params.set("lang", lang);
        if (selectedTag) params.set("tag", selectedTag);
        router.push(`/search?${params.toString()}`);
    };

    return (
        <form onSubmit={handleSubmit}>
            {/* 検索バー */}
            <div className="form-group">
                <div style={{ position: "relative", display: "flex", gap: "10px" }}>
                    <div style={{ position: "relative", flex: 1 }}>
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
                            style={{ paddingLeft: "40px", width: "100%" }}
                            placeholder="キーワードで検索..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* フィルター */}
            <div className="search-filters" style={{ marginBottom: "var(--space-6)" }}>
                <select
                    className="form-select"
                    style={{ width: "auto" }}
                    value={selectedLanguage}
                    onChange={handleLanguageChange}
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
                                type="button"
                                onClick={() => handleTagClick(selectedTag)}
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
                            type="button"
                            key={tag.name}
                            className={`tag-badge ${selectedTag === tag.name ? "active" : ""}`}
                            onClick={() => handleTagClick(tag.name)}
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

            {/* Enterキーで送信できるが、明示的な検索ボタンはデザイン的に隠す・不要なら消す */}
            <button type="submit" style={{ display: 'none' }}>検索</button>
        </form>
    );
}
