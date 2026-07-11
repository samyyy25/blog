# ~/logbook — a multi-author personal blog

A small Next.js 14 (App Router) blog with real authentication: anyone can read
published posts, but writing, editing, and deleting posts requires a signed-in
author account, enforced on the server (not just hidden in the UI).

## What's inside

- **Next.js 14 App Router** — one full-stack project, deployable straight to Vercel.
- **PostgreSQL + Prisma** — `User` and `Post` models, see `prisma/schema.prisma`.
- **NextAuth.js (Credentials provider)** — email + password, sessions as JWTs.
- **`middleware.ts`** blocks every `/admin/*` route for anyone not signed in.
- **Server Actions** (`lib/actions.ts`) do the actual create/update/delete work,
  and each one re-checks the session and, for edit/delete, ownership — so even
  if someone bypassed the UI, the server rejects the request.
- **Invite-code gated signup** — anyone can visit `/register`, but creating an
  account requires the `SIGNUP_CODE` you set in your environment variables, so
  a public site doesn't let random visitors become authors.
- Same warm/amber "cozy night coder" visual design as the earlier prototype.

## How access control works

| Who | Can do |
|---|---|
| Anonymous visitor | Read published posts, read author profiles |
| Signed-in author | Everything above, plus: create posts, edit/delete **their own** posts, edit **their own** profile |

There's no separate "admin" role — every author has equal publishing rights
over their own content. If you want a stricter setup (e.g. only some authors
can publish, or an admin who can moderate everyone's posts), that's a
reasonably small change to `lib/actions.ts` (add a `role` field to `User` and
check it in `requireSession`/the ownership checks).

## Local setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Get a Postgres database.** Easiest options:
   - [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres) (built on Neon, integrates directly with your Vercel project)
   - [Neon](https://neon.tech) or [Supabase](https://supabase.com) (both have free tiers)
   - A local Postgres instance if you have one

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   Fill in:
   - `DATABASE_URL` — your Postgres connection string
   - `NEXTAUTH_SECRET` — generate one with `openssl rand -base64 32`
   - `NEXTAUTH_URL` — `http://localhost:3000` for local dev
   - `SIGNUP_CODE` — pick a code and only share it with people you want as authors

4. **Create the database tables**
   ```bash
   npx prisma migrate dev --name init
   ```

5. **Run it**
   ```bash
   npm run dev
   ```
   Visit `http://localhost:3000`, go to **become an author**, enter your
   `SIGNUP_CODE`, then sign in and start writing from **/admin**.

## Deploying to Vercel

1. Push this project to a GitHub repo.
2. In Vercel, **Add New Project** → import the repo.
3. Add a Postgres database: Project → **Storage** → **Create Database** → Postgres
   (this automatically sets `DATABASE_URL` for you), or paste in a connection
   string from Neon/Supabase under **Settings → Environment Variables**.
4. Add the other environment variables in **Settings → Environment Variables**:
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL` — your production URL, e.g. `https://your-blog.vercel.app`
   - `SIGNUP_CODE`
5. Deploy. The build command (`prisma generate && next build`, already set in
   `package.json`) runs automatically.
6. **Run the migration against your production database once**, from your
   local machine, pointed at the production `DATABASE_URL`:
   ```bash
   DATABASE_URL="your-production-connection-string" npx prisma migrate deploy
   ```
   (Or use Vercel's "Deploy Hooks" / a one-off `vercel env pull` + `prisma migrate deploy` — any
   approach that runs `prisma migrate deploy` against the production database works.)
7. Visit your live URL, register your first author account, and start writing.

## Extending it

- **Rich content**: swap the simple blank-line/```code``` format for a markdown
  library (e.g. `react-markdown`) if you want full Markdown support.
- **Image uploads**: add [Vercel Blob](https://vercel.com/docs/storage/vercel-blob) or
  Cloudinary for post cover images and avatars.
- **Roles**: add a `role` column to `User` (`AUTHOR` / `ADMIN`) and let admins
  edit or unpublish anyone's post.
- **Comments**: a `Comment` model plus a public (no-login) form is a natural next step.
