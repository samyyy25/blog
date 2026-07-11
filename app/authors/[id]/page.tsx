import { notFound } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import PostCard from "@/components/PostCard";

export const dynamic = "force-dynamic";

export default async function AuthorPage({ params }: { params: { id: string } }) {
  const author = await prisma.user.findUnique({ where: { id: params.id } });
  if (!author) notFound();

  const session = await getServerSession(authOptions);
  const isSelf = session?.user?.id === author.id;

  const posts = await prisma.post.findMany({
    where: { authorId: author.id, ...(isSelf ? {} : { published: true }) },
    orderBy: { createdAt: "desc" },
    include: { author: { select: { id: true, name: true } } },
  });

  return (
    <section className="about">
      <Link href="/" className="back-link">&larr; Back to the log</Link>
      <div className="about__avatar">{author.avatarText || author.name.slice(0, 2).toUpperCase()}</div>
      <h1 className="about__title">{author.name}</h1>
      {author.tagline && <p style={{ color: "var(--amber-soft)", fontFamily: "var(--font-mono)", fontSize: 13 }}>{author.tagline}</p>}
      {author.bio.split(/\n\s*\n/).filter(Boolean).map((para, i) => <p key={i}>{para}</p>)}

      {(author.github || author.twitter || author.website) && (
        <div className="about__contact">
          {author.github && <a href={author.github} className="icon-link" target="_blank" rel="noreferrer">GitHub</a>}
          {author.twitter && <a href={author.twitter} className="icon-link" target="_blank" rel="noreferrer">Twitter</a>}
          {author.website && <a href={author.website} className="icon-link" target="_blank" rel="noreferrer">Website</a>}
        </div>
      )}

      {isSelf && (
        <p style={{ marginTop: 20 }}>
          <Link href="/admin/profile" className="btn btn--ghost">Edit profile</Link>
        </p>
      )}

      <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, margin: "36px 0 16px" }}>
        Posts by {author.name}
      </h2>
      {posts.length === 0 ? (
        <div className="empty-state">No posts yet.</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {posts.map((p) => <PostCard key={p.slug} post={p} showDraftBadge={isSelf} />)}
        </div>
      )}
    </section>
  );
}
