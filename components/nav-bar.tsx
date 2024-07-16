"use client";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Edit, Home, List } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

export default function NavBar() {
  const pathname = usePathname();
  const router = useRouter();
  return (
    <div className="flex justify-between px-4 py-2 items-center bg-background border-t">
      <div className="flex flex-row gap-4 items-center">
        <Button
          variant="outline"
          size="icon"
          className={cn({
            "border-muted-foreground": pathname === "/dashboard",
          })}
          onClick={() => router.push("/dashboard")}
        >
          <Home className={cn("h-[1.2rem] w-[1.2rem]")} />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className={cn({
            "border-muted-foreground": pathname === "/dashboard/transactions",
          })}
          onClick={() => router.push("/dashboard/transactions")}
        >
          <List className={cn("h-[1.2rem] w-[1.2rem]")} />
        </Button>
      </div>
      <ThemeToggle />
    </div>
  );
}
