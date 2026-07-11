import { prisma } from "@/lib/prisma";
import PostCard from "@/components/PostCard";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    include: { author: { select: { id: true, name: true } } },
  });

  const [featured, ...rest] = posts;

  return (
    <>
      <div className="hero">
        <span className="eyebrow">// a shared developer's notebook</span>
        <h1>Notes from the terminal, warmed by lamplight.</h1>
        <p>
          Field notes, small tools, and lessons learned the slow way — written by a handful of
          developers who think best after the house goes quiet.
        </p>
      </div>

      <div className="section">
        <div className="section__head">
          <span className="section__label">// recent posts</span>
        </div>

        {posts.length === 0 ? (
          <div className="empty-state">No posts published yet.</div>
        ) : (
          <div className="grid">
            <PostCard post={featured} big showDraftBadge={false} />
            {rest.map((p) => (
              <PostCard key={p.slug} post={p} showDraftBadge={false} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
