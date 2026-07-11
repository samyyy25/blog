import { notFound } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { deletePost } from "@/lib/actions";
import { estimateReadTime, formatDate } from "@/lib/content";
import ContentBlocks from "@/components/ContentBlocks";
import DeleteButton from "@/components/DeleteButton";

export const dynamic = "force-dynamic";

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await prisma.post.findUnique({
    where: { slug: params.slug },
    include: { author: { select: { id: true, name: true } } },
  });
  if (!post) notFound();

  const session = await getServerSession(authOptions);
  const isOwner = session?.user?.id === post.authorId;
  if (!post.published && !isOwner) notFound();

  const tags = post.tags.split(",").map((t) => t.trim()).filter(Boolean);
  const boundDelete = deletePost.bind(null, post.id);

  return (
    <article className="post-detail">
      <Link href="/" className="back-link">&larr; Back to the log</Link>

      {isOwner && (
        <div className="detail-actions">
          <Link href={`/admin/edit/${post.id}`} className="btn btn--ghost">Edit</Link>
          <DeleteButton action={boundDelete} />
          {!post.published && <span className="badge-draft" style={{ alignSelf: "center" }}>draft — only visible to you</span>}
        </div>
      )}

      <div className="post-card__meta">
        <span>{formatDate(post.createdAt)}</span>
        <span>•</span>
        <span>{estimateReadTime(post.content)}</span>
      </div>
      <h1 className="post-detail__title">{post.title}</h1>
      <div className="post-card__tags" style={{ marginBottom: 26 }}>
        {tags.map((t) => <span className="tag-pill" key={t}>#{t}</span>)}
      </div>
      <p className="post-card__author" style={{ marginBottom: 30 }}>
        by <Link href={`/authors/${post.author.id}`}>{post.author.name}</Link>
      </p>

      <ContentBlocks raw={post.content} />
    </article>
  );
}
