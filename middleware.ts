import NextAuth from "next-auth"
import authConfig from "./auth.config"
 
const { auth } = NextAuth(authConfig)

export default auth((req)=>{  

console.log("asdfasdfasdfasdf")

})
export const config={
    matcher: ['/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)','/(api|trpc)(.*)',],
}