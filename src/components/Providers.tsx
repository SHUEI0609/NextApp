// NextAuth SessionProvider ラッパーコンポーネント
// Why: NextAuth v5のuseSession()フックを使うには、ツリー全体をSessionProviderでラップする必要がある

"use client";

import { SessionProvider } from "next-auth/react";

interface ProvidersProps {
    children: React.ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
    return <SessionProvider>{children}</SessionProvider>;
}
