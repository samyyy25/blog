"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slugify";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export type ActionState = { error?: string } | undefined;

// ---------- helpers ----------

async function requireSession() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error("You must be signed in to do that.");
  }
  return session;
}

// ---------- auth / account ----------
// These use the useFormState({error}) pattern instead of throwing, so
// validation problems (bad invite code, duplicate email, ...) show up
// inline in the form instead of tripping Next's error boundary.

export async function registerUser(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").toLowerCase().trim();
  const password = String(formData.get("password") || "");
  const code = String(formData.get("code") || "");

  if (!name || !email || !password) {
    return { error: "Name, email, and password are all required." };
  }
  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }
  // Gate account creation behind an invite code so random visitors to a
  // public site can't give themselves publishing access.
  if (code !== process.env.SIGNUP_CODE) {
    return { error: "That invite code isn't right." };
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "An account with that email already exists." };
  }

  const hashed = await bcrypt.hash(password, 10);
  await prisma.user.create({
    data: {
      name,
      email,
      password: hashed,
      avatarText: name.slice(0, 2).toUpperCase(),
    },
  });

  redirect("/login?registered=1");
}

export async function updateProfile(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await requireSession();

  const name = String(formData.get("name") || "").trim();
  if (!name) return { error: "Name can't be empty." };

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name,
      avatarText: String(formData.get("avatarText") || "").slice(0, 2).toUpperCase(),
      tagline: String(formData.get("tagline") || "").trim(),
      bio: String(formData.get("bio") || "").trim(),
      github: String(formData.get("github") || "").trim(),
      twitter: String(formData.get("twitter") || "").trim(),
      website: String(formData.get("website") || "").trim(),
    },
  });

  revalidatePath("/admin/profile");
  revalidatePath("/authors/" + session.user.id);
  redirect("/authors/" + session.user.id);
}

// ---------- posts ----------

export async function createPost(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await requireSession();

  const title = String(formData.get("title") || "").trim();
  const content = String(formData.get("content") || "").trim();
  if (!title || !content) {
    return { error: "A post needs at least a title and some content." };
  }

  const excerpt = String(formData.get("excerpt") || "").trim() || content.slice(0, 140);
  const tags = String(formData.get("tags") || "").trim();
  const published = formData.get("published") === "on";

  const post = await prisma.post.create({
    data: {
      slug: slugify(title),
      title,
      content,
      excerpt,
      tags,
      published,
      authorId: session.user.id,
    },
  });

  revalidatePath("/");
  redirect(`/posts/${post.slug}`);
}

export async function updatePost(
  postId: string,
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await requireSession();

  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post) return { error: "That post doesn't exist." };
  if (post.authorId !== session.user.id) {
    return { error: "You can only edit your own posts." };
  }

  const title = String(formData.get("title") || "").trim();
  const content = String(formData.get("content") || "").trim();
  if (!title || !content) {
    return { error: "A post needs at least a title and some content." };
  }

  const excerpt = String(formData.get("excerpt") || "").trim() || content.slice(0, 140);
  const tags = String(formData.get("tags") || "").trim();
  const published = formData.get("published") === "on";

  const updated = await prisma.post.update({
    where: { id: postId },
    data: { title, content, excerpt, tags, published },
  });

  revalidatePath("/");
  revalidatePath(`/posts/${updated.slug}`);
  redirect(`/posts/${updated.slug}`);
}

export async function deletePost(postId: string) {
  const session = await requireSession();

  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post) throw new Error("That post doesn't exist.");
  if (post.authorId !== session.user.id) {
    throw new Error("You can only delete your own posts.");
  }

  await prisma.post.delete({ where: { id: postId } });

  revalidatePath("/");
  redirect("/admin");
}
