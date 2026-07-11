"use client";
import { useFormState } from "react-dom";
import SubmitButton from "@/components/SubmitButton";
import type { ActionState } from "@/lib/actions";

type Initial = {
  title: string;
  excerpt: string;
  tags: string;
  content: string;
  published: boolean;
};

export default function PostForm({
  action,
  initial,
  submitLabel,
}: {
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
  initial?: Initial;
  submitLabel: string;
}) {
  const [state, formAction] = useFormState(action, undefined);

  return (
    <form action={formAction}>
      {state?.error && <div className="error-banner" style={{ margin: "0 0 18px" }}>{state.error}</div>}

      <label className="form-label">Title</label>
      <input className="form-input" name="title" defaultValue={initial?.title} placeholder="A great title" required />

      <label className="form-label">Tags (comma separated)</label>
      <input className="form-input" name="tags" defaultValue={initial?.tags} placeholder="react, meta" />

      <label className="form-label">
        Excerpt <span className="form-hint">(shown on the card — optional)</span>
      </label>
      <textarea className="form-textarea" name="excerpt" rows={2} defaultValue={initial?.excerpt} />

      <label className="form-label">
        Content <span className="form-hint">(blank line = new paragraph; wrap a block in ``` for code)</span>
      </label>
      <textarea
        className="form-textarea form-textarea--body"
        name="content"
        rows={14}
        defaultValue={initial?.content}
        placeholder={"Start writing here...\n\nLeave a blank line between paragraphs.\n\n```\nyour code here\n```"}
        required
      />

      <div className="checkbox-row">
        <input type="checkbox" id="published" name="published" defaultChecked={initial?.published ?? true} />
        <label htmlFor="published">Published (visible to visitors)</label>
      </div>

      <div className="form-actions">
        <SubmitButton label={submitLabel} />
      </div>
    </form>
  );
}
