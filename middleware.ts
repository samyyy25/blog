import { withAuth } from "next-auth/middleware";

// Every route under /admin requires a signed-in author.
// Unauthenticated visitors are redirected to /login.
export default withAuth({
  pages: {
    signIn: "/login",
  },
});

export const config = {
  matcher: ["/admin/:path*"],
};
