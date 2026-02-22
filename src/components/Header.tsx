"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { FiSearch, FiPlus, FiMenu, FiX, FiLogOut } from "react-icons/fi";

/**
 * ヘッダーコンポーネント
 * ナビゲーションバー：ロゴ、検索バー、投稿ボタン、認証状態に応じたユーザーメニュー
 */
export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const { data: session } = useSession();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
        }
    };

    const handleSignOut = async () => {
        await signOut({ callbackUrl: "/" });
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

                    {session?.user ? (
                        // ログイン済み: ユーザー名 + ログアウトボタン
                        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
                            <span
                                style={{
                                    fontSize: "var(--text-sm)",
                                    fontWeight: 600,
                                    color: "var(--color-text-primary)",
                                }}
                            >
                                {session.user.name || session.user.email}
                            </span>
                            <button
                                className="btn btn-ghost"
                                onClick={handleSignOut}
                                title="ログアウト"
                                style={{ display: "flex", alignItems: "center", gap: "var(--space-1)" }}
                            >
                                <FiLogOut size={16} />
                                <span className="hide-mobile">ログアウト</span>
                            </button>
                        </div>
                    ) : (
                        // 未ログイン: ログインボタン
                        <Link href="/auth/signin" className="btn btn-secondary">
                            ログイン
                        </Link>
                    )}

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
