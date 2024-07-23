"use client";

import { SessionProvider } from "next-auth/react";

export const AuthSessionProvider = ({ children }: React.PropsWithChildren) => {
  return <SessionProvider>{children}</SessionProvider>;
};
