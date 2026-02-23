// アプリケーション全体で使用する型定義

/** コードファイル型 */
export interface CodeFileData {
    id: string;
    filename: string;
    content: string;
    language: string;
}

/** 投稿カード表示用の型 */
export interface PostCardData {
    id: string;
    title: string;
    description: string | null;
    language: string;
    tags: string[];
    isDraft: boolean;
    viewCount: number;
    createdAt: string;
    updatedAt: string;
    author: {
        id: string;
        name: string | null;
        image: string | null;
    };
    files: CodeFileData[];
    _count: {
        likes: number;
        bookmarks: number;
        comments: number;
    };
    isLiked?: boolean;
    isBookmarked?: boolean;
    comments?: CommentData[];
}

/** ユーザープロフィール型 */
export interface UserProfile {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
    bio: string | null;
    createdAt: string;
    _count: {
        posts: number;
        followers: number;
        following: number;
    };
    isFollowing?: boolean;
}

/** コメント型 */
export interface CommentData {
    id: string;
    content: string;
    createdAt: string;
    user: {
        id: string;
        name: string | null;
        image: string | null;
    };
}

/** サポートする言語一覧 */
export const SUPPORTED_LANGUAGES = [
    "typescript",
    "javascript",
    "python",
    "go",
    "julia",
    "rust",
    "java",
    "c",
    "cpp",
    "csharp",
    "ruby",
    "php",
    "swift",
    "kotlin",
    "html",
    "css",
    "sql",
    "shell",
    "yaml",
    "json",
    "markdown",
    "other",
] as const;

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

/** 言語表示名マッピング */
export const LANGUAGE_DISPLAY_NAMES: Record<SupportedLanguage, string> = {
    typescript: "TypeScript",
    javascript: "JavaScript",
    python: "Python",
    go: "Go",
    julia: "Julia",
    rust: "Rust",
    java: "Java",
    c: "C",
    cpp: "C++",
    csharp: "C#",
    ruby: "Ruby",
    php: "PHP",
    swift: "Swift",
    kotlin: "Kotlin",
    html: "HTML",
    css: "CSS",
    sql: "SQL",
    shell: "Shell",
    yaml: "YAML",
    json: "JSON",
    markdown: "Markdown",
    other: "Other",
};

/** 言語カラーマッピング（GitHubの言語カラーを参考） */
export const LANGUAGE_COLORS: Record<SupportedLanguage, string> = {
    typescript: "#3178c6",
    javascript: "#f1e05a",
    python: "#3572A5",
    go: "#00ADD8",
    julia: "#a270ba",
    rust: "#dea584",
    java: "#b07219",
    c: "#555555",
    cpp: "#f34b7d",
    csharp: "#178600",
    ruby: "#701516",
    php: "#4F5D95",
    swift: "#F05138",
    kotlin: "#A97BFF",
    html: "#e34c26",
    css: "#563d7c",
    sql: "#e38c00",
    shell: "#89e051",
    yaml: "#cb171e",
    json: "#292929",
    markdown: "#083fa1",
    other: "#666666",
};
