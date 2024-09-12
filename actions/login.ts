"use server"

import { LoginSchema } from "@/schemas"
import * as z from "zod";

export const Login= async (values : z.infer<typeof LoginSchema> )=>{
    const validatedFields = LoginSchema.safeParse(values)

 if(! validatedFields){
    return{error: "Invalid Credentials"}
 }
 return {success: "Correct Credentials"}

}