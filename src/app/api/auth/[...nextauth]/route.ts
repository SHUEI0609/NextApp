// NextAuth v5 APIルートハンドラ
// Why: /api/auth/* へのリクエストをNextAuthが処理するためのエントリーポイント

import { handlers } from "@/lib/auth";

export const { GET, POST } = handlers;
