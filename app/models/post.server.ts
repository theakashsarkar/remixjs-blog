import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

export async function getPosts() {
    return db.post.findMany();
}

export async function getPost(slug: string) {
    return db.post.findUnique({ where: {slug}})
}

export async function createPost(post) {
    return db.post.create({ data: post })
}