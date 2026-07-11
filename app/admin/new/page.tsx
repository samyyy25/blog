import Link from "next/link";
import { createPost } from "@/lib/actions";
import PostForm from "@/components/PostForm";

export default function NewPostPage() {
  return (
    <div className="form-section">
      <Link href="/admin" className="back-link">&larr; Back to dashboard</Link>
      <h1 className="form-title">Write a new post</h1>
      <PostForm action={createPost} submitLabel="Publish post" />
    </div>
  );
}
