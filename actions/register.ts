"use server";

import { RegisterSchema } from "@/schemas";
import { getUserByEmail } from "@/data/user";
import * as z from "zod";
import bcrypt from "bcrypt";
import { db } from "../lib/db";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";

export const Register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid Credentials" };
  }
  const { email, password, name } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return { error: "Email Already in use" };
  }

  await db.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });
  const verificationEmail = await generateVerificationToken(email)
  await sendVerificationEmail(
    verificationEmail.email,
    verificationEmail.token
  )


  return { success:"Confermation email sent!" };
};
