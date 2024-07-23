import type { Metadata } from "next";
import { Ubuntu_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthSessionProvider } from "@/components/auth-session-provider";

const fontMono = Ubuntu_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "why-am-i-broke",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "bg-background font-mono antialiased overflow-hidden",
          fontMono.className
        )}
      >
        <AuthSessionProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
          </ThemeProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
