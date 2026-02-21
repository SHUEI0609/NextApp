"use client";

import { useState } from "react";
import Link from "next/link";
import { FiSearch, FiPlus, FiMenu, FiX } from "react-icons/fi";

/**
 * ヘッダーコンポーネント
 * ナビゲーションバー：ロゴ、検索バー、投稿ボタン、ユーザーメニュー
 */
export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
        }
    };

    return (
        <header className="header">
            <div className="header-inner">
                {/* ロゴ */}
                <Link href="/" className="header-logo">
                    <span className="header-logo-icon">{"</>"}</span>
                    <span>Codex</span>
                </Link>

                {/* 検索バー */}
                <form className="header-search" onSubmit={handleSearch}>
                    <FiSearch className="header-search-icon" />
                    <input
                        type="text"
                        placeholder="コードを検索... タグ、言語、キーワード"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </form>

                {/* アクション */}
                <div className="header-actions">
                    <Link href="/posts/new" className="btn btn-primary">
                        <FiPlus />
                        <span className="hide-mobile">投稿する</span>
                    </Link>
                    <Link href="/auth/signin" className="btn btn-secondary">
                        ログイン
                    </Link>

                    {/* モバイルメニューボタン */}
                    <button
                        className="btn btn-ghost btn-icon mobile-only"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        style={{ display: "none" }}
                    >
                        {mobileMenuOpen ? <FiX /> : <FiMenu />}
                    </button>
                </div>
            </div>
        </header>
    );
}
