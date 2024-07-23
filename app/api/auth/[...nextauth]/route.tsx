import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import NextAuth from "next-auth/next";

const handler = NextAuth(authOptions);
const { signIn } = handler;
export { handler as GET, handler as POST, signIn };
