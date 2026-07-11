import { notFound } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updatePost } from "@/lib/actions";
import PostForm from "@/components/PostForm";

export default async function EditPostPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const post = await prisma.post.findUnique({ where: { id: params.id } });

  if (!post) notFound();
  if (post.authorId !== session!.user.id) notFound(); // no peeking at / editing someone else's post

  const boundAction = updatePost.bind(null, post.id);

  return (
    <div className="form-section">
      <Link href="/admin" className="back-link">&larr; Back to dashboard</Link>
      <h1 className="form-title">Edit post</h1>
      <PostForm
        action={boundAction}
        submitLabel="Save changes"
        initial={{
          title: post.title,
          excerpt: post.excerpt,
          tags: post.tags,
          content: post.content,
          published: post.published,
        }}
      />
    </div>
  );
}
