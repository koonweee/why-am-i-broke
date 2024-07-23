import NextAuth from "next-auth";

import GitHubProvider from "next-auth/providers/github";
import { Provider } from "next-auth/providers/index";

const providers: Provider[] = [
  GitHubProvider({
    clientId: process.env.GITHUB_CLIENT_ID!,
    clientSecret: process.env.GITHUB_CLIENT_SECRET!,
  }),
];

export const authOptions = {
  providers,
  session: {
    strategy: "jwt" as const,
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/",
  },
};

export const providerMap = providers.map((provider) => {
  if (typeof provider === "function") {
    const providerData = (provider as any)();
    return {
      id: providerData.id,
      name: providerData.name,
    };
  } else {
    return {
      id: provider.id,
      name: provider.name,
    };
  }
});

export const { handlers, signIn, signOut, auth } = NextAuth(authOptions);
