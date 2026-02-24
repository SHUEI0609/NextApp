import { prisma } from "./src/lib/prisma";

async function main() {
    const userId = "cm7ib2d7e0000a6e60b1v4vvw"; // Get a real user ID or just find any like
    const likes = await prisma.like.findFirst({
        where: { userId },
        include: { post: true }
    });
    console.log("Likes:", likes);
}

main().catch(console.error).finally(() => prisma.$disconnect());
