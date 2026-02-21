import { MOCK_TRENDING_TAGS } from "@/lib/mockData";
import { FiTrendingUp } from "react-icons/fi";
import Link from "next/link";

/**
 * サイドバーコンポーネント
 * トレンドタグ・おすすめ情報を表示
 */
export default function Sidebar() {
    return (
        <aside className="sidebar">
            {/* トレンドタグ */}
            <div className="sidebar-section">
                <h3 className="sidebar-title">
                    <FiTrendingUp style={{ display: "inline", marginRight: "4px" }} />
                    トレンドタグ
                </h3>
                <div className="sidebar-tag-list">
                    {MOCK_TRENDING_TAGS.map((tag) => (
                        <Link
                            key={tag.name}
                            href={`/search?tag=${encodeURIComponent(tag.name)}`}
                            className="tag-badge"
                        >
                            #{tag.name}
                            <span style={{ opacity: 0.6, marginLeft: "2px" }}>
                                {tag.count}
                            </span>
                        </Link>
                    ))}
                </div>
            </div>

            {/* ナビゲーション */}
            <div className="sidebar-section">
                <h3 className="sidebar-title">ナビゲーション</h3>
                <nav style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    <Link href="/" className="user-menu-item">
                        🏠 ホーム
                    </Link>
                    <Link href="/search" className="user-menu-item">
                        🔍 検索
                    </Link>
                    <Link href="/posts/new" className="user-menu-item">
                        ✏️ 投稿する
                    </Link>
                </nav>
            </div>

            {/* フッター */}
            <div className="sidebar-section" style={{ marginTop: "auto" }}>
                <p
                    style={{
                        fontSize: "var(--text-xs)",
                        color: "var(--color-text-tertiary)",
                        lineHeight: 1.5,
                    }}
                >
                    © 2026 Codex
                    <br />
                    エンジニアのためのコード共有プラットフォーム
                </p>
            </div>
        </aside>
    );
}
