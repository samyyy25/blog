"use client";
import { useState } from "react";

export default function DeleteButton({
  action,
}: {
  action: () => Promise<void>;
}) {
  const [confirming, setConfirming] = useState(false);

  if (!confirming) {
    return (
      <button type="button" className="btn btn--ghost" onClick={() => setConfirming(true)}>
        Delete
      </button>
    );
  }

  return (
    <span style={{ display: "inline-flex", gap: 8, alignItems: "center" }}>
      <span className="form-hint" style={{ fontFamily: "var(--font-mono)", fontSize: 12.5 }}>Delete this post?</span>
      <button type="button" className="btn btn--danger" onClick={() => action()}>
        Yes, delete
      </button>
      <button type="button" className="btn btn--ghost" onClick={() => setConfirming(false)}>
        Cancel
      </button>
    </span>
  );
}
