"use client";

import { useState } from "react";

/**
 * コードビューアコンポーネント
 * シンタックスハイライト＋行番号表示
 * Why: PrismJSのSSR問題を回避するため、クライアントサイドでのみレンダリング
 */
interface CodeViewerProps {
    code: string;
    language: string;
    filename?: string;
    maxHeight?: string;
    showLineNumbers?: boolean;
}

// 簡易シンタックスハイライト
// Why: PrismJSの動的インポートの複雑さを回避しつつ、視覚的にコードを見やすくするため
function highlightCode(code: string, language: string): string {
    // キーワードの色分け
    const keywords: Record<string, string[]> = {
        python: ["def", "class", "import", "from", "return", "if", "else", "elif", "for", "while", "in", "not", "and", "or", "True", "False", "None", "self", "with", "as", "try", "except", "raise", "yield", "lambda", "pass", "break", "continue", "async", "await"],
        typescript: ["const", "let", "var", "function", "return", "if", "else", "for", "while", "class", "interface", "type", "export", "import", "from", "default", "extends", "implements", "new", "this", "async", "await", "try", "catch", "throw", "typeof", "instanceof", "enum", "readonly", "public", "private", "protected", "static", "abstract"],
        javascript: ["const", "let", "var", "function", "return", "if", "else", "for", "while", "class", "export", "import", "from", "default", "extends", "new", "this", "async", "await", "try", "catch", "throw", "typeof", "instanceof"],
        go: ["package", "import", "func", "return", "if", "else", "for", "range", "struct", "interface", "type", "var", "const", "defer", "go", "chan", "map", "make", "new", "nil", "true", "false", "switch", "case", "default", "break", "continue", "select"],
        rust: ["fn", "let", "mut", "pub", "use", "mod", "struct", "enum", "impl", "trait", "return", "if", "else", "for", "while", "loop", "match", "self", "Self", "true", "false", "const", "static", "async", "await", "where", "type", "ref", "move", "unsafe"],
        julia: ["function", "end", "return", "if", "else", "elseif", "for", "while", "struct", "module", "import", "using", "export", "const", "let", "true", "false", "nothing", "begin", "do", "try", "catch", "finally", "throw", "macro", "abstract", "mutable"],
        java: ["public", "private", "protected", "class", "interface", "extends", "implements", "return", "if", "else", "for", "while", "new", "this", "static", "final", "void", "int", "String", "boolean", "import", "package", "try", "catch", "throw", "throws"],
        c: ["int", "void", "char", "float", "double", "return", "if", "else", "for", "while", "struct", "typedef", "include", "define", "const", "static", "unsigned", "long", "short", "sizeof", "switch", "case", "break", "continue", "NULL"],
        cpp: ["int", "void", "char", "float", "double", "return", "if", "else", "for", "while", "class", "struct", "public", "private", "protected", "virtual", "override", "const", "static", "new", "delete", "template", "typename", "namespace", "using", "auto", "nullptr", "include"],
        css: ["color", "background", "border", "margin", "padding", "display", "flex", "grid", "position", "width", "height", "font", "transition", "animation", "transform", "opacity"],
        html: ["div", "span", "p", "a", "h1", "h2", "h3", "h4", "h5", "h6", "ul", "ol", "li", "img", "input", "button", "form", "section", "header", "footer", "nav", "main", "article"],
    };

    // HTML特殊文字のエスケープ
    let escaped = code
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

    // 文字列ハイライト (ダブルクォート、シングルクォート、テンプレートリテラル)
    escaped = escaped.replace(
        /(&quot;|")((?:(?!(?:&quot;|")).)*?)(&quot;|")/g,
        '<span style="color:#a5d6a7">$1$2$3</span>'
    );
    escaped = escaped.replace(
        /(&#39;|')((?:(?!(?:&#39;|')).)*?)(&#39;|')/g,
        '<span style="color:#a5d6a7">$1$2$3</span>'
    );

    // コメントハイライト
    escaped = escaped.replace(
        /(\/\/.*$|#(?!include|define).*$)/gm,
        '<span style="color:#6a737d;font-style:italic">$1</span>'
    );

    // 数値ハイライト
    escaped = escaped.replace(
        /\b(\d+\.?\d*)\b/g,
        '<span style="color:#f8c555">$1</span>'
    );

    // キーワードのハイライト
    const lang = language.toLowerCase();
    const langKeywords = keywords[lang] || keywords["typescript"] || [];
    langKeywords.forEach((kw) => {
        const regex = new RegExp(`\\b(${kw})\\b`, "g");
        escaped = escaped.replace(
            regex,
            `<span style="color:#c792ea;font-weight:600">$1</span>`
        );
    });

    return escaped;
}

export default function CodeViewer({
    code,
    language,
    filename,
    maxHeight,
    showLineNumbers = true,
}: CodeViewerProps) {
    const lines = code.split("\n");
    const highlighted = highlightCode(code, language);

    return (
        <div className="code-viewer" style={maxHeight ? { maxHeight, overflow: "auto" } : undefined}>
            <div className="code-line-numbers">
                {showLineNumbers && (
                    <div className="line-numbers">
                        {lines.map((_, i) => (
                            <div key={i}>{i + 1}</div>
                        ))}
                    </div>
                )}
                <div className="code-content">
                    <pre>
                        <code dangerouslySetInnerHTML={{ __html: highlighted }} />
                    </pre>
                </div>
            </div>
        </div>
    );
}

/**
 * ファイルタブ付きコードビューア
 * 複数ファイル投稿時のタブ切り替えUI
 */
interface FileTabsViewerProps {
    files: Array<{
        id: string;
        filename: string;
        content: string;
        language: string;
    }>;
}

export function FileTabsViewer({ files }: FileTabsViewerProps) {
    const [activeFileIndex, setActiveFileIndex] = useState(0);
    const activeFile = files[activeFileIndex];

    if (!activeFile) return null;

    return (
        <div>
            {files.length > 1 && (
                <div className="file-tabs">
                    {files.map((file, index) => (
                        <button
                            key={file.id}
                            className={`file-tab ${index === activeFileIndex ? "active" : ""}`}
                            onClick={() => setActiveFileIndex(index)}
                        >
                            📄 {file.filename}
                        </button>
                    ))}
                </div>
            )}
            <CodeViewer
                code={activeFile.content}
                language={activeFile.language}
                filename={activeFile.filename}
            />
        </div>
    );
}
