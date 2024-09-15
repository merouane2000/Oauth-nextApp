"use server";

import { LoginSchema } from "@/schemas";
import { signIn } from '@/auth';
import * as z from "zod";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";
import { getUserByEmail } from "@/data/user";
import { generateVerificationToken } from "@/lib/tokens";


export const Login = async (values: z.infer<typeof LoginSchema>) => {
  // Validate the fields
  const validatedFields = LoginSchema.safeParse(values);

  // If validation fails, return an error
  if (!validatedFields.success) {
    return { error: "Invalid Credentials" };
  }

  // Destructure the validated fields safely
  const { email, password } = validatedFields.data;
  const existingUser = await getUserByEmail(email)
  if(!existingUser || !existingUser.email || !existingUser.password){
    return{error: "Email does not exist  "}
  }

  // if(!existingUser.emailVerified){
  //   const verificationToken = await generateVerificationToken(existingUser.email)
  //   return {success :"Confermation email sent"}
  // }



  try {
    // Attempt to sign in
    await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT
    });
  } catch (error) {
    // Handle authentication errors
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid Credentials" };
        default:
          return { error: "Something went wrong" };
      }
    }
    throw error; // Rethrow if it's not an AuthError
  }
};
