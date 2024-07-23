"use client";
import TransactionDataProvider from "@/components/context/transaction-data-provider";
import HeaderBar from "@/components/header-bar";
import NavBar from "@/components/nav-bar";
import { LoadingSpinner } from "@/components/ui/spinner";
import { signIn, useSession } from "next-auth/react";
import { useRef, useState } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { data: session, status } = useSession();
  const loggedIn = status === "authenticated";
  const loading = status === "loading";
  if (status === "unauthenticated") {
    // Sleep for 2 seconds to show the loading spinner
    setTimeout(() => {}, 2000);
    signIn();
  }
  return (
    <div className="flex h-[100dvh] flex-col md:flex-row justify-center">
      {loggedIn && (
        <TransactionDataProvider>
          <HeaderBar />
          <div
            className="flex-grow px-3 py-2 md:overflow-y-auto md:p-12 overflow-scroll no-scrollbar"
            ref={scrollContainerRef}
          >
            {children}
          </div>
          <NavBar scrollContainerRef={scrollContainerRef} />
        </TransactionDataProvider>
      )}
      {!loggedIn && (
        <div className="flex flex-col items-center justify-center place-self-center">
          <div className="flex flex-row items-center gap-3">
            <LoadingSpinner className="fill-muted-foreground" />
            {loading ? "Loading..." : "Redirecting to sign in"}
          </div>
        </div>
      )}
    </div>
  );
}
