import type { NextAuthConfig } from "next-auth";
import Credentials from 'next-auth/providers/credentials';
import { LoginSchema } from '@/schemas';
import bcrypt from "bcryptjs";
import { getUserByEmail } from "./data/user";

export default {
  providers: [
    Credentials({
      async authorize(credentials) {
        // Validate the provided credentials
        const validatedFields = LoginSchema.safeParse(credentials);

        if (validatedFields.success) {
          const { email, password } = validatedFields.data;

          // Fetch user from the database
          const user = await getUserByEmail(email);
          if (!user || !user.password) return null; // Return null instead of undefined

          // Compare passwords using bcrypt
          const passwordsMatch = await bcrypt.compare(password, user.password);
          if (passwordsMatch) {
            return user; // Return the user if authentication is successful
          }
        }

        return null; // Return null in case of any failure
      }
    })
  ],
} satisfies NextAuthConfig;
