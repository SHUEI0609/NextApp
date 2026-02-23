"use client";

import { useState } from "react";
import { FiPlus, FiTrash2, FiSave, FiSend, FiArrowLeft } from "react-icons/fi";
import {
    SUPPORTED_LANGUAGES,
    LANGUAGE_DISPLAY_NAMES,
} from "@/types/types";
import { inferLanguageFromFilename } from "@/lib/utils";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

interface FileEntry {
    id: string;
    filename: string;
    content: string;
    language: string;
}

interface EditPostClientProps {
    post: {
        id: string;
        title: string;
        description: string;
        language: string;
        tags: string[];
        isDraft: boolean;
        files: FileEntry[];
    };
}

export default function EditPostClient({ post }: EditPostClientProps) {
    const router = useRouter();
    const [title, setTitle] = useState(post.title);
    const [description, setDescription] = useState(post.description);
    const [mainLanguage, setMainLanguage] = useState<string>(post.language);
    const [tagsInput, setTagsInput] = useState(post.tags.join(", "));
    const [files, setFiles] = useState<FileEntry[]>(
        post.files.length > 0 ? post.files : [{ id: "f-1", filename: "main.ts", content: "", language: "typescript" }]
    );
    const [activeFileIndex, setActiveFileIndex] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const addFile = () => {
        const newFile: FileEntry = {
            id: `new-f-${Date.now()}`,
            filename: `file${files.length + 1}.ts`,
            content: "",
            language: "typescript",
        };
        setFiles([...files, newFile]);
        setActiveFileIndex(files.length);
    };

    const removeFile = (index: number) => {
        if (files.length <= 1) return;
        const newFiles = files.filter((_, i) => i !== index);
        setFiles(newFiles);
        setActiveFileIndex(Math.min(activeFileIndex, newFiles.length - 1));
    };

    const updateFile = (index: number, updates: Partial<FileEntry>) => {
        const newFiles = [...files];
        newFiles[index] = { ...newFiles[index], ...updates };

        if (updates.filename) {
            newFiles[index].language = inferLanguageFromFilename(updates.filename);
        }

        setFiles(newFiles);
    };

    const handleSubmit = async (isDraft: boolean) => {
        setIsSubmitting(true);
        try {
            const postData = {
                title,
                description,
                language: mainLanguage,
                tags: tagsInput
                    .split(",")
                    .map((t) => t.trim())
                    .filter(Boolean),
                isDraft,
                files: files.map((f) => ({
                    filename: f.filename,
                    content: f.content,
                    language: f.language,
                })),
            };

            const res = await fetch(`/api/posts/${post.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(postData),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "更新に失敗しました");
            }

            toast.success(isDraft ? "下書きとして更新しました" : "更新しました！");

            if (!isDraft) {
                router.push(`/posts/${post.id}`);
                router.refresh(); // 最新状態を反映
            }
        } catch (error: unknown) {
            console.error("更新エラー:", error);
            toast.error(error instanceof Error ? error.message : "予期せぬエラーが発生しました");
        } finally {
            setIsSubmitting(false);
        }
    };

    const activeFile = files[activeFileIndex];

    return (
        <div className="main-layout">
            <main className="main-content">
                <div className="post-form">
                    <Link
                        href={`/posts/${post.id}`}
                        className="btn btn-ghost"
                        style={{ marginBottom: "var(--space-4)" }}
                    >
                        <FiArrowLeft /> 投稿に戻る
                    </Link>

                    <h1 style={{ fontSize: "var(--text-2xl)", fontWeight: 800, marginBottom: "var(--space-6)" }}>
                        ✏️ 投稿を編集
                    </h1>

                    {/* タイトル */}
                    <div className="form-group">
                        <label className="form-label">タイトル *</label>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="例: Pythonで作るシンプルなニューラルネットワーク"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>

                    {/* 説明文 */}
                    <div className="form-group">
                        <label className="form-label">説明文</label>
                        <textarea
                            className="form-textarea"
                            placeholder="コードの説明や背景を書いてください..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    {/* メイン言語 */}
                    <div className="form-group">
                        <label className="form-label">メインの使用言語 *</label>
                        <select
                            className="form-select"
                            value={mainLanguage}
                            onChange={(e) => setMainLanguage(e.target.value)}
                        >
                            {SUPPORTED_LANGUAGES.map((lang) => (
                                <option key={lang} value={lang}>
                                    {LANGUAGE_DISPLAY_NAMES[lang]}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* タグ */}
                    <div className="form-group">
                        <label className="form-label">タグ</label>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="カンマ区切りで入力（例: 機械学習, Python, 初心者向け）"
                            value={tagsInput}
                            onChange={(e) => setTagsInput(e.target.value)}
                        />
                        <p className="form-hint">
                            カンマ（,）で区切って複数のタグを入力できます
                        </p>
                    </div>

                    {/* コードファイル */}
                    <div className="form-group">
                        <label className="form-label">コードファイル *</label>

                        {/* ファイルタブ */}
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0",
                                background: "var(--color-bg-secondary)",
                                border: "1px solid var(--color-border)",
                                borderBottom: "none",
                                borderRadius: "var(--radius-md) var(--radius-md) 0 0",
                                overflow: "hidden",
                            }}
                        >
                            {files.map((file, index) => (
                                <div
                                    key={file.id}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "var(--space-1)",
                                    }}
                                >
                                    <button
                                        className={`file-tab ${index === activeFileIndex ? "active" : ""}`}
                                        onClick={() => setActiveFileIndex(index)}
                                        style={{ borderRadius: 0 }}
                                    >
                                        📄 {file.filename}
                                    </button>
                                    {files.length > 1 && (
                                        <button
                                            className="btn btn-ghost btn-icon"
                                            onClick={() => removeFile(index)}
                                            style={{
                                                padding: "2px",
                                                minWidth: "auto",
                                                minHeight: "auto",
                                                color: "var(--color-text-tertiary)",
                                            }}
                                        >
                                            <FiTrash2 size={12} />
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button
                                className="btn btn-ghost btn-sm"
                                onClick={addFile}
                                style={{ borderRadius: 0 }}
                            >
                                <FiPlus size={14} />
                                ファイル追加
                            </button>
                        </div>

                        {/* アクティブファイルの編集 */}
                        {activeFile && (
                            <div>
                                <div
                                    style={{
                                        display: "flex",
                                        gap: "var(--space-3)",
                                        padding: "var(--space-2) var(--space-3)",
                                        background: "var(--color-bg-secondary)",
                                        borderLeft: "1px solid var(--color-border)",
                                        borderRight: "1px solid var(--color-border)",
                                    }}
                                >
                                    <input
                                        type="text"
                                        className="form-input"
                                        style={{
                                            flex: 1,
                                            padding: "var(--space-1) var(--space-2)",
                                            fontSize: "var(--text-xs)",
                                            fontFamily: "var(--font-mono)",
                                        }}
                                        placeholder="ファイル名"
                                        value={activeFile.filename}
                                        onChange={(e) =>
                                            updateFile(activeFileIndex, {
                                                filename: e.target.value,
                                            })
                                        }
                                    />
                                    <select
                                        className="form-select"
                                        style={{
                                            width: "auto",
                                            padding: "var(--space-1) var(--space-2)",
                                            fontSize: "var(--text-xs)",
                                        }}
                                        value={activeFile.language}
                                        onChange={(e) =>
                                            updateFile(activeFileIndex, {
                                                language: e.target.value,
                                            })
                                        }
                                    >
                                        {SUPPORTED_LANGUAGES.map((lang) => (
                                            <option key={lang} value={lang}>
                                                {LANGUAGE_DISPLAY_NAMES[lang]}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <textarea
                                    className="form-textarea form-code-textarea"
                                    placeholder="ここにコードを入力..."
                                    value={activeFile.content}
                                    onChange={(e) =>
                                        updateFile(activeFileIndex, { content: e.target.value })
                                    }
                                    style={{
                                        borderTopLeftRadius: 0,
                                        borderTopRightRadius: 0,
                                    }}
                                />
                            </div>
                        )}
                    </div>

                    {/* 送信ボタン */}
                    <div
                        style={{
                            display: "flex",
                            gap: "var(--space-3)",
                            justifyContent: "flex-end",
                            marginTop: "var(--space-6)",
                        }}
                    >
                        <button
                            className="btn btn-secondary btn-lg"
                            onClick={() => handleSubmit(true)}
                            disabled={isSubmitting || !title.trim()}
                        >
                            <FiSave />
                            下書き更新
                        </button>
                        <button
                            className="btn btn-primary btn-lg"
                            onClick={() => handleSubmit(false)}
                            disabled={
                                isSubmitting ||
                                !title.trim() ||
                                files.every((f) => !f.content.trim())
                            }
                        >
                            <FiSend />
                            {isSubmitting ? "更新中..." : "更新する"}
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}
