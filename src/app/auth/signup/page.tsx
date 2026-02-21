"use client";

import { useState } from "react";
import Link from "next/link";
import { FiGithub, FiMail, FiLock, FiUser } from "react-icons/fi";

/**
 * 新規登録ページ
 */
export default function SignUpPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert("パスワードが一致しません");
            return;
        }
        setIsLoading(true);
        // TODO: ユーザー登録API呼び出し
        setTimeout(() => setIsLoading(false), 1000);
    };

    return (
        <div className="main-layout">
            <main className="auth-page">
                <div className="auth-card">
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

                    <h1 className="auth-title">アカウント作成</h1>
                    <p className="auth-subtitle">
                        Codexに参加して、あなたのコードを世界に共有しよう
                    </p>

                    {/* GitHub OAuth */}
                    <button
                        className="btn btn-secondary btn-lg"
                        style={{ width: "100%", gap: "var(--space-2)" }}
                    >
                        <FiGithub size={20} />
                        GitHubで登録
                    </button>

                    <div className="auth-divider">または</div>

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">
                                <FiUser
                                    style={{
                                        display: "inline",
                                        marginRight: "4px",
                                        verticalAlign: "middle",
                                    }}
                                />
                                ユーザー名
                            </label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="your_username"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>

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
                                placeholder="8文字以上"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={8}
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
                                パスワード（確認）
                            </label>
                            <input
                                type="password"
                                className="form-input"
                                placeholder="もう一度入力"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                minLength={8}
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary btn-lg"
                            style={{ width: "100%", marginTop: "var(--space-2)" }}
                            disabled={isLoading}
                        >
                            {isLoading ? "登録中..." : "アカウントを作成"}
                        </button>
                    </form>

                    <div className="auth-footer">
                        すでにアカウントをお持ちの方は{" "}
                        <Link href="/auth/signin">ログイン</Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
