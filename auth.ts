import NextAuth, { type DefaultSession } from "next-auth";
import authConfig from "./auth.config";
import { db } from "@/lib/db";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { getUserById } from "./data/user";
import { UserRole } from "@prisma/client";
import { use } from "react";

declare module "next-auth" {
  interface session {
    user: {
      role: "ADMIN" | "USER";
    } & DefaultSession["user"];
  }
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
    pages:{
         signIn:"/auth/login",
         error:"/auth/error"
    },
  events: {
  
    async linkAccount({ user }) {
      await db.user.update({
        where: {
          id: user.id,
        }, 
        data:{emailVerified:new Date()}
      });
    },
  },
  callbacks: { 

    async signIn ({user , account}){

      if( account?.provider !== "Credentials") return true ;

      const existingUser = await getUserById(user.id);

      if(!existingUser?.emailVerified) return false;
      return true;
    },
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      if (token.role && session.user) {
        session.user.role = token.role as UserRole;
      }
      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;
      const existingUser = await getUserById(token.sub);
      if (!existingUser) return token;
      token.role = existingUser.role;
      return token;
    },
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
});
