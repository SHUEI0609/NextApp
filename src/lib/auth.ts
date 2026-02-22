// NextAuth v5 設定ファイル
// Why: Credentials Provider（メール/パスワード）でのログイン認証を実現する
// JWTストラテジーを使用（Credentials Providerはデータベースセッションと互換性がないため）

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(prisma),
    session: {
        // Why: Credentials Providerではdatabaseストラテジーが使えないためJWTを使用
        strategy: "jwt",
    },
    pages: {
        signIn: "/auth/signin",
    },
    providers: [
        Credentials({
            name: "メール/パスワード",
            credentials: {
                email: { label: "メールアドレス", type: "email" },
                password: { label: "パスワード", type: "password" },
            },
            async authorize(credentials) {
                const email = credentials?.email as string | undefined;
                const password = credentials?.password as string | undefined;

                if (!email || !password) {
                    return null;
                }

                // DBからユーザーを検索
                const user = await prisma.user.findUnique({
                    where: { email },
                });

                // ユーザーが存在しない、またはパスワードが未設定（OAuth専用アカウント等）
                if (!user || !user.hashedPassword) {
                    return null;
                }

                // パスワード照合
                const isPasswordValid = await bcrypt.compare(
                    password,
                    user.hashedPassword
                );

                if (!isPasswordValid) {
                    return null;
                }

                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    image: user.image,
                };
            },
        }),
    ],
    callbacks: {
        // JWTにユーザーIDを含める
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
        // セッションにユーザーIDを含める
        async session({ session, token }) {
            if (session.user && token.id) {
                session.user.id = token.id as string;
            }
            return session;
        },
    },
});
