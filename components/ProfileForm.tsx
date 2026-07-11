"use client";
import { useFormState } from "react-dom";
import SubmitButton from "@/components/SubmitButton";
import type { ActionState } from "@/lib/actions";

type Initial = {
  name: string;
  avatarText: string;
  tagline: string;
  bio: string;
  github: string;
  twitter: string;
  website: string;
};

export default function ProfileForm({
  action,
  initial,
}: {
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
  initial: Initial;
}) {
  const [state, formAction] = useFormState(action, undefined);

  return (
    <form action={formAction}>
      {state?.error && <div className="error-banner" style={{ margin: "0 0 18px" }}>{state.error}</div>}

      <div className="form-row">
        <div>
          <label className="form-label">Name</label>
          <input className="form-input" name="name" defaultValue={initial.name} required />
        </div>
        <div style={{ maxWidth: 140 }}>
          <label className="form-label">Avatar initials</label>
          <input className="form-input" name="avatarText" defaultValue={initial.avatarText} maxLength={2} />
        </div>
      </div>

      <label className="form-label">Tagline <span className="form-hint">(short line shown under your name)</span></label>
      <input className="form-input" name="tagline" defaultValue={initial.tagline} placeholder="// debugging things after dark" />

      <label className="form-label">Bio <span className="form-hint">(blank line for a new paragraph)</span></label>
      <textarea className="form-textarea" name="bio" rows={5} defaultValue={initial.bio} />

      <div className="form-row">
        <div>
          <label className="form-label">GitHub URL</label>
          <input className="form-input" name="github" defaultValue={initial.github} placeholder="https://github.com/you" />
        </div>
        <div>
          <label className="form-label">Twitter URL</label>
          <input className="form-input" name="twitter" defaultValue={initial.twitter} placeholder="https://twitter.com/you" />
        </div>
        <div>
          <label className="form-label">Website</label>
          <input className="form-input" name="website" defaultValue={initial.website} placeholder="https://you.dev" />
        </div>
      </div>

      <div className="form-actions">
        <SubmitButton label="Save profile" />
      </div>
    </form>
  );
}
