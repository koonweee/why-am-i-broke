import { NextAuthOptions } from "next-auth";
import { Provider } from "next-auth/providers";
import GitHubProvider from "next-auth/providers/github";

const providers: Provider[] = [
  GitHubProvider({
    clientId: process.env.GITHUB_CLIENT_ID!,
    clientSecret: process.env.GITHUB_CLIENT_SECRET!,
  }),
];

export const authOptions: NextAuthOptions = {
  providers,
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/signin",
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
