"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { FiMail, FiLock, FiUser } from "react-icons/fi";

/**
 * 新規登録ページ
 * メール/パスワードでの新規ユーザー登録
 */
export default function SignUpPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error("パスワードが一致しません");
            return;
        }

        setIsLoading(true);

        try {
            // 新規登録APIを呼び出し
            const res = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.error || "登録に失敗しました");
                return;
            }

            // 登録成功後、自動ログイン
            const signInResult = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (signInResult?.error) {
                // 登録は成功したがログインに失敗した場合
                toast.success("アカウントを作成しました。ログインしてください。");
                router.push("/auth/signin");
            } else {
                toast.success("アカウントを作成しました！");
                router.push("/");
                router.refresh();
            }
        } catch {
            toast.error("登録中にエラーが発生しました");
        } finally {
            setIsLoading(false);
        }
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
