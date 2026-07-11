// Shared helpers for the simple "blank line = paragraph, ``` = code block"
// content format used across the create/edit forms and the post page.

export type ContentBlock =
  | { type: "p"; text: string }
  | { type: "code"; lines: string[] };

export function parseContentInput(text: string): ContentBlock[] {
  const blocks = text
    .split(/\n\s*\n/)
    .map((b) => b.trim())
    .filter(Boolean);

  return blocks.map((block) => {
    if (block.startsWith("```") && block.endsWith("```")) {
      const inner = block.slice(3, -3).replace(/^\n+|\n+$/g, "");
      return { type: "code", lines: inner.split("\n") };
    }
    return { type: "p", text: block };
  });
}

export function estimateReadTime(raw: string): string {
  const words = raw.split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.round(words / 200))} min`;
}

export function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
