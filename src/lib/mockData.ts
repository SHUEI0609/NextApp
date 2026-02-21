// モックデータ - Supabase未接続時のUI動作確認用
// Why: 外部サービス未準備でもUI開発を進められるようにするため

import { PostCardData, UserProfile } from "@/types/types";

export const MOCK_USERS: UserProfile[] = [
    {
        id: "user-1",
        name: "田中太郎",
        email: "tanaka@example.com",
        image: null,
        bio: "Pythonとデータサイエンスが好きなエンジニアです。機械学習モデルのコードを共有しています。",
        createdAt: "2025-01-15T00:00:00Z",
        _count: { posts: 24, followers: 156, following: 42 },
    },
    {
        id: "user-2",
        name: "佐藤花子",
        email: "sato@example.com",
        image: null,
        bio: "フロントエンドエンジニア。React/Next.jsが得意。美しいUIコンポーネントを作るのが趣味。",
        createdAt: "2025-03-20T00:00:00Z",
        _count: { posts: 38, followers: 289, following: 67 },
    },
    {
        id: "user-3",
        name: "鈴木一郎",
        email: "suzuki@example.com",
        image: null,
        bio: "Go言語でバックエンドを書いています。マイクロサービスアーキテクチャに興味があります。",
        createdAt: "2025-06-10T00:00:00Z",
        _count: { posts: 15, followers: 98, following: 31 },
    },
];

export const MOCK_POSTS: PostCardData[] = [
    {
        id: "post-1",
        title: "Pythonで作るシンプルなニューラルネットワーク",
        description:
            "NumPyだけを使ってゼロからニューラルネットワークを実装しました。バックプロパゲーションの仕組みを理解するのに最適です。",
        language: "python",
        tags: ["機械学習", "ニューラルネットワーク", "NumPy", "初心者向け"],
        isDraft: false,
        viewCount: 1240,
        createdAt: "2026-02-18T10:30:00Z",
        updatedAt: "2026-02-18T10:30:00Z",
        author: {
            id: "user-1",
            name: "田中太郎",
            image: null,
        },
        files: [
            {
                id: "file-1",
                filename: "neural_network.py",
                language: "python",
                content: `import numpy as np

class NeuralNetwork:
    """シンプルな3層ニューラルネットワーク
    
    Why: バックプロパゲーションの基本的な仕組みを理解するため、
    フレームワークに頼らずNumPyのみで実装
    """
    
    def __init__(self, input_size: int, hidden_size: int, output_size: int):
        # Xavier初期化: 勾配消失/爆発を防ぐための重み初期化手法
        self.W1 = np.random.randn(input_size, hidden_size) * np.sqrt(2.0 / input_size)
        self.b1 = np.zeros((1, hidden_size))
        self.W2 = np.random.randn(hidden_size, output_size) * np.sqrt(2.0 / hidden_size)
        self.b2 = np.zeros((1, output_size))
    
    def sigmoid(self, x: np.ndarray) -> np.ndarray:
        return 1 / (1 + np.exp(-np.clip(x, -500, 500)))
    
    def forward(self, X: np.ndarray) -> np.ndarray:
        self.z1 = X @ self.W1 + self.b1
        self.a1 = self.sigmoid(self.z1)
        self.z2 = self.a1 @ self.W2 + self.b2
        self.a2 = self.sigmoid(self.z2)
        return self.a2
    
    def backward(self, X: np.ndarray, y: np.ndarray, lr: float = 0.1):
        m = X.shape[0]
        
        # 出力層の勾配
        dz2 = self.a2 - y
        dW2 = (self.a1.T @ dz2) / m
        db2 = np.sum(dz2, axis=0, keepdims=True) / m
        
        # 隠れ層の勾配
        dz1 = (dz2 @ self.W2.T) * self.a1 * (1 - self.a1)
        dW1 = (X.T @ dz1) / m
        db1 = np.sum(dz1, axis=0, keepdims=True) / m
        
        # パラメータ更新
        self.W2 -= lr * dW2
        self.b2 -= lr * db2
        self.W1 -= lr * dW1
        self.b1 -= lr * db1

# 使用例
if __name__ == "__main__":
    np.random.seed(42)
    X = np.array([[0,0],[0,1],[1,0],[1,1]])
    y = np.array([[0],[1],[1],[0]])
    
    nn = NeuralNetwork(2, 4, 1)
    for i in range(10000):
        output = nn.forward(X)
        nn.backward(X, y)
        if i % 2000 == 0:
            loss = np.mean((y - output) ** 2)
            print(f"Epoch {i}, Loss: {loss:.6f}")
    
    print("\\n予測結果:")
    print(nn.forward(X))`,
            },
        ],
        _count: { likes: 87, bookmarks: 34, comments: 12 },
        isLiked: false,
        isBookmarked: false,
    },
    {
        id: "post-2",
        title: "Next.js App Routerで作るモダンなダッシュボード",
        description:
            "Server ComponentsとSuspenseを活用した、パフォーマンスに優れたダッシュボードUIの実装例です。",
        language: "typescript",
        tags: ["Next.js", "React", "TypeScript", "ダッシュボード"],
        isDraft: false,
        viewCount: 892,
        createdAt: "2026-02-17T15:00:00Z",
        updatedAt: "2026-02-17T15:00:00Z",
        author: {
            id: "user-2",
            name: "佐藤花子",
            image: null,
        },
        files: [
            {
                id: "file-2",
                filename: "Dashboard.tsx",
                language: "typescript",
                content: `import { Suspense } from 'react';

interface StatsCardProps {
  title: string;
  value: number;
  change: number;
  icon: string;
}

function StatsCard({ title, value, change, icon }: StatsCardProps) {
  const isPositive = change >= 0;
  return (
    <div className="stats-card">
      <div className="stats-icon">{icon}</div>
      <div className="stats-info">
        <h3>{title}</h3>
        <p className="stats-value">{value.toLocaleString()}</p>
        <span className={\`stats-change \${isPositive ? 'positive' : 'negative'}\`}>
          {isPositive ? '+' : ''}{change}%
        </span>
      </div>
    </div>
  );
}

async function DashboardStats() {
  // Server Componentでデータ取得
  const stats = [
    { title: "総ユーザー数", value: 12840, change: 12.5, icon: "👥" },
    { title: "月間投稿数", value: 3420, change: 8.3, icon: "📝" },
    { title: "総いいね数", value: 89200, change: -2.1, icon: "❤️" },
    { title: "アクティブ率", value: 67, change: 5.7, icon: "📊" },
  ];

  return (
    <div className="stats-grid">
      {stats.map(stat => (
        <StatsCard key={stat.title} {...stat} />
      ))}
    </div>
  );
}

export default function Dashboard() {
  return (
    <main className="dashboard">
      <h1>ダッシュボード</h1>
      <Suspense fallback={<div className="loading">読み込み中...</div>}>
        <DashboardStats />
      </Suspense>
    </main>
  );
}`,
            },
            {
                id: "file-2b",
                filename: "dashboard.module.css",
                language: "css",
                content: `.dashboard {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.stats-card {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: transform 0.2s ease;
}

.stats-card:hover {
  transform: translateY(-4px);
}

.stats-icon {
  font-size: 2.5rem;
}

.stats-value {
  font-size: 1.8rem;
  font-weight: 700;
  color: #e0e0ff;
}

.positive { color: #4ade80; }
.negative { color: #f87171; }`,
            },
        ],
        _count: { likes: 64, bookmarks: 28, comments: 8 },
        isLiked: true,
        isBookmarked: false,
    },
    {
        id: "post-3",
        title: "GoでHTTPサーバーを自作する",
        description:
            "標準ライブラリのnet/httpを使って、ミドルウェアパターンを含むHTTPサーバーを実装します。",
        language: "go",
        tags: ["Go", "HTTP", "サーバー", "バックエンド"],
        isDraft: false,
        viewCount: 567,
        createdAt: "2026-02-16T08:00:00Z",
        updatedAt: "2026-02-16T08:00:00Z",
        author: {
            id: "user-3",
            name: "鈴木一郎",
            image: null,
        },
        files: [
            {
                id: "file-3",
                filename: "server.go",
                language: "go",
                content: `package main

import (
\t"encoding/json"
\t"fmt"
\t"log"
\t"net/http"
\t"time"
)

// Middleware はHTTPハンドラーをラップする関数型
type Middleware func(http.Handler) http.Handler

// LoggingMiddleware はリクエストのログを出力するミドルウェア
// Why: リクエストの処理時間を計測し、パフォーマンス監視を可能にする
func LoggingMiddleware(next http.Handler) http.Handler {
\treturn http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
\t\tstart := time.Now()
\t\tnext.ServeHTTP(w, r)
\t\tduration := time.Since(start)
\t\tlog.Printf("[%s] %s %s - %v", r.Method, r.URL.Path, r.RemoteAddr, duration)
\t})
}

// CORSMiddleware はCORSヘッダーを設定するミドルウェア
func CORSMiddleware(next http.Handler) http.Handler {
\treturn http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
\t\tw.Header().Set("Access-Control-Allow-Origin", "*")
\t\tw.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE")
\t\tw.Header().Set("Access-Control-Allow-Headers", "Content-Type")
\t\tif r.Method == "OPTIONS" {
\t\t\tw.WriteHeader(http.StatusOK)
\t\t\treturn
\t\t}
\t\tnext.ServeHTTP(w, r)
\t})
}

// Chain は複数のミドルウェアを順番に適用する
func Chain(handler http.Handler, middlewares ...Middleware) http.Handler {
\tfor i := len(middlewares) - 1; i >= 0; i-- {
\t\thandler = middlewares[i](handler)
\t}
\treturn handler
}

type Response struct {
\tMessage string \`json:"message"\`
\tTime    string \`json:"time"\`
}

func main() {
\tmux := http.NewServeMux()

\tmux.HandleFunc("/api/hello", func(w http.ResponseWriter, r *http.Request) {
\t\tw.Header().Set("Content-Type", "application/json")
\t\tjson.NewEncoder(w).Encode(Response{
\t\t\tMessage: "Hello, World!",
\t\t\tTime:    time.Now().Format(time.RFC3339),
\t\t})
\t})

\thandler := Chain(mux, LoggingMiddleware, CORSMiddleware)

\tfmt.Println("Server starting on :8080")
\tlog.Fatal(http.ListenAndServe(":8080", handler))
}`,
            },
        ],
        _count: { likes: 45, bookmarks: 19, comments: 5 },
        isLiked: false,
        isBookmarked: true,
    },
    {
        id: "post-4",
        title: "Rustで作る安全なパスワードハッシュ関数",
        description:
            "Argon2アルゴリズムを使った安全なパスワードハッシュの実装。セキュリティのベストプラクティスも解説。",
        language: "rust",
        tags: ["Rust", "セキュリティ", "暗号化", "パスワード"],
        isDraft: false,
        viewCount: 723,
        createdAt: "2026-02-15T20:00:00Z",
        updatedAt: "2026-02-15T20:00:00Z",
        author: {
            id: "user-1",
            name: "田中太郎",
            image: null,
        },
        files: [
            {
                id: "file-4",
                filename: "password.rs",
                language: "rust",
                content: `use argon2::{self, Config, Variant, Version};
use rand::Rng;

/// パスワードをArgon2idでハッシュ化する
/// 
/// Why: Argon2idはメモリハード関数であり、GPUによる並列攻撃に強い
/// bcryptやscryptと比較して、より高いセキュリティを提供する
pub fn hash_password(password: &str) -> Result<String, argon2::Error> {
    let mut salt = [0u8; 32];
    rand::thread_rng().fill(&mut salt);
    
    let config = Config {
        variant: Variant::Argon2id, // ハイブリッド: サイドチャネル攻撃とGPU攻撃の両方に対応
        version: Version::Version13,
        mem_cost: 65536,     // 64MB: メモリ使用量
        time_cost: 3,        // 反復回数
        lanes: 4,            // 並列度
        ..Default::default()
    };
    
    argon2::hash_encoded(password.as_bytes(), &salt, &config)
}

/// ハッシュとパスワードを検証する
pub fn verify_password(hash: &str, password: &str) -> Result<bool, argon2::Error> {
    argon2::verify_encoded(hash, password.as_bytes())
}

#[cfg(test)]
mod tests {
    use super::*;
    
    #[test]
    fn test_hash_and_verify() {
        let password = "my_secure_password_123";
        let hash = hash_password(password).unwrap();
        
        assert!(verify_password(&hash, password).unwrap());
        assert!(!verify_password(&hash, "wrong_password").unwrap());
    }
}`,
            },
        ],
        _count: { likes: 52, bookmarks: 31, comments: 7 },
        isLiked: false,
        isBookmarked: false,
    },
    {
        id: "post-5",
        title: "Julia で数値微分と自動微分の比較",
        description:
            "数値微分（有限差分法）と自動微分（ForwardDiff.jl）の精度・速度を比較するコードです。",
        language: "julia",
        tags: ["Julia", "数値計算", "自動微分", "科学計算"],
        isDraft: false,
        viewCount: 345,
        createdAt: "2026-02-14T12:00:00Z",
        updatedAt: "2026-02-14T12:00:00Z",
        author: {
            id: "user-2",
            name: "佐藤花子",
            image: null,
        },
        files: [
            {
                id: "file-5",
                filename: "differentiation.jl",
                language: "julia",
                content: `using ForwardDiff
using BenchmarkTools

# 数値微分（中心差分法）
# Why: 前方差分 O(h) より中心差分 O(h²) の方が精度が高い
function numerical_derivative(f, x; h=1e-8)
    return (f(x + h) - f(x - h)) / (2h)
end

# テスト関数: f(x) = sin(x³) + exp(-x²)
f(x) = sin(x^3) + exp(-x^2)

# 解析的な導関数（検証用）
f_exact(x) = 3x^2 * cos(x^3) - 2x * exp(-x^2)

x₀ = 1.5

println("=== 微分の比較 (x = $x₀) ===")
println("解析解:     ", f_exact(x₀))
println("数値微分:   ", numerical_derivative(f, x₀))
println("自動微分:   ", ForwardDiff.derivative(f, x₀))
println()

# 誤差比較
exact = f_exact(x₀)
err_numerical = abs(numerical_derivative(f, x₀) - exact)
err_autodiff = abs(ForwardDiff.derivative(f, x₀) - exact)
println("数値微分の誤差: ", err_numerical)
println("自動微分の誤差: ", err_autodiff)`,
            },
        ],
        _count: { likes: 38, bookmarks: 22, comments: 4 },
        isLiked: true,
        isBookmarked: true,
    },
    {
        id: "post-6",
        title: "TypeScriptの高度な型パズル集",
        description:
            "Conditional Types、Template Literal Types、Mapped Typesを駆使した型レベルプログラミングの例題集。",
        language: "typescript",
        tags: ["TypeScript", "型システム", "上級者向け"],
        isDraft: false,
        viewCount: 1580,
        createdAt: "2026-02-13T09:00:00Z",
        updatedAt: "2026-02-13T09:00:00Z",
        author: {
            id: "user-2",
            name: "佐藤花子",
            image: null,
        },
        files: [
            {
                id: "file-6",
                filename: "type-puzzles.ts",
                language: "typescript",
                content: `// === 型レベルプログラミング集 ===

// 1. DeepReadonly: ネストされたオブジェクトもすべてreadonly
type DeepReadonly<T> = T extends object
  ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
  : T;

// 2. PathOf: オブジェクトのネストされたパスを文字列リテラル型として取得
type PathOf<T, Prefix extends string = ""> = T extends object
  ? {
      [K in keyof T & string]: K | \`\${K}.\${PathOf<T[K]>}\`
    }[keyof T & string]
  : never;

// 3. Awaited (再帰的にPromiseをアンラップ)
type DeepAwaited<T> = T extends Promise<infer U> ? DeepAwaited<U> : T;

// 使用例
interface Config {
  server: {
    host: string;
    port: number;
    ssl: {
      enabled: boolean;
      cert: string;
    };
  };
  database: {
    url: string;
  };
}

// "server" | "server.host" | "server.port" | "server.ssl" | ...
type ConfigPaths = PathOf<Config>;

// テスト
const path1: ConfigPaths = "server.ssl.enabled"; // ✅
// const path2: ConfigPaths = "server.invalid"; // ❌ コンパイルエラー`,
            },
        ],
        _count: { likes: 112, bookmarks: 67, comments: 18 },
        isLiked: false,
        isBookmarked: false,
    },
];

/** トレンドタグ（モック） */
export const MOCK_TRENDING_TAGS = [
    { name: "機械学習", count: 234 },
    { name: "React", count: 189 },
    { name: "TypeScript", count: 176 },
    { name: "Go", count: 145 },
    { name: "Rust", count: 132 },
    { name: "Python", count: 298 },
    { name: "Next.js", count: 112 },
    { name: "セキュリティ", count: 87 },
    { name: "アルゴリズム", count: 156 },
    { name: "初心者向け", count: 203 },
];
