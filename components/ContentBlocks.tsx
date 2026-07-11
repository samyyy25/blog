import { parseContentInput } from "@/lib/content";

export default function ContentBlocks({ raw }: { raw: string }) {
  const blocks = parseContentInput(raw);
  return (
    <div className="post-detail__body">
      {blocks.map((block, i) =>
        block.type === "code" ? (
          <pre className="code-block" key={i}>
            {block.lines.join("\n")}
          </pre>
        ) : (
          <p key={i}>{block.text}</p>
        )
      )}
    </div>
  );
}
