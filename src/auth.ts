import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      authorization: {
        params: {
          prompt: "select_account",
        },
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    // On first sign-in, ensure new Google users get role "customer".
    async signIn({ user, account }) {
      if (account?.provider === "google" && user.email) {
        const existing = await db.user.findUnique({ where: { email: user.email } });
        if (!existing) {
          // The adapter will create the user; we just want to make sure role default = "customer"
          // which is already the schema default. No-op here.
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      // On sign-in `user` is present. After that, only `token` is.
      if (user?.id) {
        token.userId = user.id;
      }
      // Always re-fetch role from DB so it's current.
      if (token.userId) {
        const dbUser = await db.user.findUnique({
          where: { id: token.userId as string },
          select: { role: true, name: true, image: true, email: true },
        });
        if (dbUser) {
          token.role = dbUser.role;
          token.name = dbUser.name;
          token.picture = dbUser.image;
          token.email = dbUser.email;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.userId as string;
        // @ts-expect-error - augmenting session.user type
        session.user.role = token.role as string;
        // Make sure Google profile picture (and any updates) flow through to the client.
        session.user.image = (token.picture as string | null | undefined) ?? session.user.image;
        session.user.name = (token.name as string | null | undefined) ?? session.user.name;
        session.user.email = (token.email as string | null | undefined) ?? session.user.email;
      }
      return session;
    },
  },
});
