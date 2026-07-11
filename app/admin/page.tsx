import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { deletePost } from "@/lib/actions";
import { formatDate } from "@/lib/content";
import DeleteButton from "@/components/DeleteButton";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  // middleware.ts already blocks unauthenticated visitors from /admin/*,
  // this session lookup is just to know *which* author is signed in.
  const session = await getServerSession(authOptions);
  const posts = await prisma.post.findMany({
    where: { authorId: session!.user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="section" style={{ paddingTop: 40 }}>
      <div className="section__head">
        <span className="section__label">// your dashboard</span>
        <div style={{ display: "flex", gap: 12 }}>
          <Link href="/admin/profile" className="btn btn--ghost">Edit profile</Link>
          <Link href="/admin/new" className="btn btn--primary">+ New post</Link>
        </div>
      </div>

      {posts.length === 0 ? (
        <div className="empty-state">You haven't written anything yet — start with "New post" above.</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {posts.map((post) => (
            <div key={post.id} className="post-card" style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div className="post-card__meta">
                  <span>{formatDate(post.createdAt)}</span>
                  {!post.published && <span className="badge-draft">draft</span>}
                </div>
                <Link href={`/posts/${post.slug}`} className="post-card__title" style={{ display: "block" }}>
                  {post.title}
                </Link>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <Link href={`/admin/edit/${post.id}`} className="btn btn--ghost">Edit</Link>
                <DeleteButton action={deletePost.bind(null, post.id)} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
