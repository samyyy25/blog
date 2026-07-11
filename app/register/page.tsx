"use client";
import { useFormState } from "react-dom";
import Link from "next/link";
import { registerUser } from "@/lib/actions";
import SubmitButton from "@/components/SubmitButton";

export default function RegisterPage() {
  const [state, formAction] = useFormState(registerUser, undefined);

  return (
    <div className="auth-card">
      <h1>Become an author</h1>
      {state?.error && <div className="error-banner" style={{ margin: "0 0 18px" }}>{state.error}</div>}
      <form action={formAction}>
        <label className="form-label">Name</label>
        <input className="form-input" name="name" required />
        <label className="form-label">Email</label>
        <input className="form-input" type="email" name="email" required />
        <label className="form-label">Password <span className="form-hint">(8+ characters)</span></label>
        <input className="form-input" type="password" name="password" minLength={8} required />
        <label className="form-label">Invite code</label>
        <input className="form-input" name="code" required />
        <div className="form-actions">
          <SubmitButton label="Create account" />
        </div>
      </form>
      <p className="hint">
        Already have an account? <Link href="/login" style={{ color: "var(--amber-soft)" }}>Sign in</Link>
      </p>
    </div>
  );
}
