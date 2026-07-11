import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateProfile } from "@/lib/actions";
import ProfileForm from "@/components/ProfileForm";

export default async function EditProfilePage() {
  const session = await getServerSession(authOptions);
  const user = await prisma.user.findUnique({ where: { id: session!.user.id } });
  if (!user) return null;

  return (
    <div className="form-section">
      <Link href="/admin" className="back-link">&larr; Back to dashboard</Link>
      <h1 className="form-title">Edit profile</h1>
      <ProfileForm
        action={updateProfile}
        initial={{
          name: user.name,
          avatarText: user.avatarText,
          tagline: user.tagline,
          bio: user.bio,
          github: user.github,
          twitter: user.twitter,
          website: user.website,
        }}
      />
    </div>
  );
}
