import { SupportedLanguage, LANGUAGE_COLORS } from "@/types/types";

/**
 * ユーザーアバターコンポーネント
 * 画像がない場合はイニシャルを表示
 */
interface UserAvatarProps {
    name: string | null;
    image: string | null;
    size?: "sm" | "md" | "lg" | "xl";
}

export default function UserAvatar({
    name,
    image,
    size = "md",
}: UserAvatarProps) {
    const initial = name ? name.charAt(0).toUpperCase() : "?";

    // Why: ユーザー名からハッシュ値を生成し、一貫したランダム色を割り当てるため
    const colorIndex = name
        ? name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) % 6
        : 0;

    const colors = [
        "#6c5ce7",
        "#00b894",
        "#e17055",
        "#0984e3",
        "#d63031",
        "#fdcb6e",
    ];

    const sizeClass =
        size === "sm"
            ? "avatar-sm"
            : size === "lg"
                ? "avatar-lg"
                : size === "xl"
                    ? "avatar-xl"
                    : "";

    return (
        <div
            className={`avatar ${sizeClass}`}
            style={{ background: image ? "transparent" : colors[colorIndex] }}
        >
            {image ? (
                <img src={image} alt={name || "ユーザー"} />
            ) : (
                <span>{initial}</span>
            )}
        </div>
    );
}

/**
 * タグバッジコンポーネント
 */
interface TagBadgeProps {
    tag: string;
    clickable?: boolean;
}

export function TagBadge({ tag, clickable = true }: TagBadgeProps) {
    if (clickable) {
        return (
            <a
                href={`/search?tag=${encodeURIComponent(tag)}`}
                className="tag-badge"
            >
                #{tag}
            </a>
        );
    }
    return <span className="tag-badge">#{tag}</span>;
}

/**
 * 言語バッジコンポーネント
 */
interface LanguageBadgeProps {
    language: string;
}

export function LanguageBadge({ language }: LanguageBadgeProps) {
    const color =
        LANGUAGE_COLORS[language as SupportedLanguage] || "#666666";

    return (
        <span className="tag-badge-lang" style={{ background: color }}>
            {language}
        </span>
    );
}
