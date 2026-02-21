"use client";

import { useState } from "react";
import Link from "next/link";
import { FiGithub, FiMail, FiLock } from "react-icons/fi";

/**
 * サインインページ
 * GitHub OAuth + メール/パスワード認証
 */
export default function SignInPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // TODO: NextAuth signIn() 呼び出し
        setTimeout(() => setIsLoading(false), 1000);
    };

    const handleGitHubSignIn = () => {
        // TODO: NextAuth signIn("github") 呼び出し
    };

    return (
        <div className="main-layout">
            <main className="auth-page">
                <div className="auth-card">
                    {/* ロゴ */}
                    <div style={{ textAlign: "center", marginBottom: "var(--space-4)" }}>
                        <div
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                width: "56px",
                                height: "56px",
                                background: "var(--color-accent-gradient)",
                                borderRadius: "var(--radius-lg)",
                                fontSize: "var(--text-2xl)",
                                marginBottom: "var(--space-3)",
                            }}
                        >
                            {"</>"}
                        </div>
                    </div>

                    <h1 className="auth-title">おかえりなさい</h1>
                    <p className="auth-subtitle">
                        Codexにログインして、コードの世界を探索しよう
                    </p>

                    {/* GitHub OAuth */}
                    <button
                        className="btn btn-secondary btn-lg"
                        style={{ width: "100%", gap: "var(--space-2)" }}
                        onClick={handleGitHubSignIn}
                    >
                        <FiGithub size={20} />
                        GitHubでログイン
                    </button>

                    <div className="auth-divider">または</div>

                    {/* メール/パスワードフォーム */}
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">
                                <FiMail
                                    style={{
                                        display: "inline",
                                        marginRight: "4px",
                                        verticalAlign: "middle",
                                    }}
                                />
                                メールアドレス
                            </label>
                            <input
                                type="email"
                                className="form-input"
                                placeholder="your@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                <FiLock
                                    style={{
                                        display: "inline",
                                        marginRight: "4px",
                                        verticalAlign: "middle",
                                    }}
                                />
                                パスワード
                            </label>
                            <input
                                type="password"
                                className="form-input"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary btn-lg"
                            style={{ width: "100%", marginTop: "var(--space-2)" }}
                            disabled={isLoading}
                        >
                            {isLoading ? "ログイン中..." : "ログイン"}
                        </button>
                    </form>

                    <div className="auth-footer">
                        アカウントをお持ちでない方は{" "}
                        <Link href="/auth/signup">新規登録</Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
