// ユーティリティ関数群

/**
 * 相対的な日付文字列を返す（例: "3時間前"、"2日前"）
 * Why: タイムライン表示でPixivライクな「○○前」表記を実現するため
 */
export function formatRelativeTime(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    const diffMonth = Math.floor(diffDay / 30);
    const diffYear = Math.floor(diffDay / 365);

    if (diffSec < 60) return "たった今";
    if (diffMin < 60) return `${diffMin}分前`;
    if (diffHour < 24) return `${diffHour}時間前`;
    if (diffDay < 30) return `${diffDay}日前`;
    if (diffMonth < 12) return `${diffMonth}ヶ月前`;
    return `${diffYear}年前`;
}

/**
 * トレンドスコア計算
 * Why: 「いいねが多く、かつ新しい投稿」を上位表示するアルゴリズム
 * Hackers News風のランキングアルゴリズムを参考に実装
 * score = likes / (hours_since_post + 2) ^ gravity
 */
export function calculateTrendScore(
    likeCount: number,
    createdAt: string,
    gravity: number = 1.8
): number {
    const now = new Date();
    const postDate = new Date(createdAt);
    const hoursSincePost =
        (now.getTime() - postDate.getTime()) / (1000 * 60 * 60);
    return likeCount / Math.pow(hoursSincePost + 2, gravity);
}

/**
 * テキストを指定文字数で切り詰め
 */
export function truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
}

/**
 * コード行数を数える
 */
export function countLines(code: string): number {
    return code.split("\n").length;
}

/**
 * ファイル拡張子から言語を推定
 */
export function inferLanguageFromFilename(filename: string): string {
    const ext = filename.split(".").pop()?.toLowerCase();
    const mapping: Record<string, string> = {
        ts: "typescript",
        tsx: "typescript",
        js: "javascript",
        jsx: "javascript",
        py: "python",
        go: "go",
        jl: "julia",
        rs: "rust",
        java: "java",
        c: "c",
        cpp: "cpp",
        cc: "cpp",
        cs: "csharp",
        rb: "ruby",
        php: "php",
        swift: "swift",
        kt: "kotlin",
        html: "html",
        css: "css",
        sql: "sql",
        sh: "shell",
        bash: "shell",
        yml: "yaml",
        yaml: "yaml",
        json: "json",
        md: "markdown",
    };
    return mapping[ext || ""] || "other";
}
