"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const justRegistered = params.get("registered") === "1";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (res?.error) {
      setError("Incorrect email or password.");
      return;
    }
    router.push("/admin");
    router.refresh();
  };

  return (
    <div className="auth-card">
      <h1>Sign in</h1>
      {justRegistered && <div className="success-banner" style={{ margin: "0 0 18px" }}>Account created — sign in below.</div>}
      {error && <div className="error-banner" style={{ margin: "0 0 18px" }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <label className="form-label">Email</label>
        <input className="form-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <label className="form-label">Password</label>
        <input className="form-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <div className="form-actions">
          <button className="btn btn--primary" type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </div>
      </form>
      <p className="hint">
        Not an author yet? <Link href="/register" style={{ color: "var(--amber-soft)" }}>Request an account</Link>
      </p>
    </div>
  );
}
