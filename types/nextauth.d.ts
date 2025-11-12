import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;               // user ID
      name?: string | null;
      email?: string | null;
      phone?: string | null;    // ✅ added phone
      role?: string | null;     // optional if you want role in session
      // add other fields if needed
    };
  }

  interface User {
    id: string;
    phone?: string | null;      // optional, if you return user from authorize
    role?: string | null;       // optional
  }
}
