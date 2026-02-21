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
