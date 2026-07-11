import Link from "next/link";
import { estimateReadTime, formatDate } from "@/lib/content";

type Props = {
  post: {
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    tags: string;
    published: boolean;
    createdAt: Date;
    author: { name: string; id: string };
  };
  big?: boolean;
  showDraftBadge?: boolean;
};

export default function PostCard({ post, big, showDraftBadge }: Props) {
  const tags = post.tags.split(",").map((t) => t.trim()).filter(Boolean);
  return (
    <Link
      href={`/posts/${post.slug}`}
      className="post-card"
      style={big ? { gridColumn: "span 2" } : undefined}
    >
      <div className="post-card__meta">
        <span>{formatDate(post.createdAt)}</span>
        <span>•</span>
        <span>{estimateReadTime(post.content)}</span>
        {showDraftBadge && !post.published && <span className="badge-draft">draft</span>}
      </div>
      <h3 className="post-card__title" style={big ? { fontSize: 27 } : undefined}>
        {post.title}
      </h3>
      <p className="post-card__excerpt">{post.excerpt}</p>
      <div className="post-card__tags">
        {tags.map((t) => (
          <span className="tag-pill" key={t}>#{t}</span>
        ))}
      </div>
      <div className="post-card__author">by {post.author.name}</div>
    </Link>
  );
}
