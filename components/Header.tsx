import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import SignOutButton from "@/components/SignOutButton";

export default async function Header() {
  const session = await getServerSession(authOptions);

  return (
    <nav className="nav">
      <Link href="/" className="nav__logo">~/logbook</Link>
      <div className="nav__links">
        <Link href="/">home</Link>
        {session ? (
          <>
            <Link href="/admin">dashboard</Link>
            <Link href={`/authors/${session.user.id}`}>my profile</Link>
            <SignOutButton />
          </>
        ) : (
          <>
            <Link href="/login">sign in</Link>
            <Link href="/register">become an author</Link>
          </>
        )}
      </div>
    </nav>
  );
}
