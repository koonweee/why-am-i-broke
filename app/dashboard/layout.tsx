"use client";
import TransactionDataProvider from "@/components/context/transaction-data-provider";
import HeaderBar from "@/components/header-bar";
import NavBar from "@/components/nav-bar";
import { useRef, useState } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  return (
    <div className="flex h-[100dvh] flex-col md:flex-row">
      <TransactionDataProvider>
        <HeaderBar />
        <div
          className="flex-grow px-3 py-2 md:overflow-y-auto md:p-12 overflow-scroll"
          ref={scrollContainerRef}
        >
          {children}
        </div>
        <NavBar scrollContainerRef={scrollContainerRef} />
      </TransactionDataProvider>
    </div>
  );
}
