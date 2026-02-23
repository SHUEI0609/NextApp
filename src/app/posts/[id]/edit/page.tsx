import { prisma } from "@/lib/prisma";
import EditPostClient from "./EditPostClient";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function EditPostPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const session = await auth();

    if (!session?.user?.id) {
        redirect("/auth/signin");
    }

    const post = await prisma.post.findUnique({
        where: { id },
        include: {
            files: true,
        },
    });

    if (!post) {
        notFound();
    }

    // 投稿者本人のみが編集可能
    if (post.authorId !== session.user.id) {
        redirect(`/posts/${post.id}`);
    }

    // クライアントに渡すための整形
    const postData = {
        id: post.id,
        title: post.title,
        description: post.description || "",
        language: post.language,
        tags: post.tags,
        isDraft: post.isDraft,
        files: post.files.map(f => ({
            id: f.id,
            filename: f.filename,
            content: f.content,
            language: f.language,
        })),
    };

    return <EditPostClient post={postData} />;
}
