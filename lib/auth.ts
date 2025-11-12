import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./prisma";
import bcrypt from "bcrypt";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: { email: {}, password: {} },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const user = await prisma.user.findUnique({ where: { email: credentials.email } });
        if (!user) return null;
        const isMatch = await bcrypt.compare(credentials.password, user.password);
        if (!isMatch) return null;
        return { id: user.id.toString(), name: user.name, email: user.email, phone: user.phone };
      },
    }),
  ],
  session: { strategy: "jwt" },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.phone = (user as any).phone; // add phone here
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.id) session.user.id = token.id as string;
      if (token?.phone) session.user.phone = token.phone as string; // add phone here
      return session;
    },
  },
  

  secret: process.env.NEXTAUTH_SECRET, // ✅ REQUIRED
};
