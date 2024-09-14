import { UserRole } from "@prisma/client";
import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

// Extend the `User` type to include `role`
declare module "next-auth" {
    interface User {
        role: UserRole;
    }

    interface Session {
        user: {
            role: "ADMIN" | "USER";
        } & DefaultSession["user"];
    }
}


