"use client";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Home, List } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

interface Props {
  scrollContainerRef: React.RefObject<HTMLDivElement>;
}

export default function NavBar(props: Props) {
  const { scrollContainerRef } = props;
  const pathname = usePathname();
  const router = useRouter();
  const changeRoute = (route: string) => {
    router.push(route);
    // Scroll to top
    scrollContainerRef.current?.scroll({
      top: 0,
      behavior: "smooth",
    });
  };
  return (
    <div className="flex justify-between px-4 py-2 items-center bg-background border-t">
      <div className="flex flex-row gap-4 items-center">
        <Button
          variant="outline"
          size="icon"
          className={cn({
            "border-muted-foreground": pathname === "/dashboard",
          })}
          onClick={() => changeRoute("/dashboard")}
        >
          <Home className={cn("h-[1.2rem] w-[1.2rem]")} />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className={cn({
            "border-muted-foreground": pathname === "/dashboard/transactions",
          })}
          onClick={() => changeRoute("/dashboard/transactions")}
        >
          <List className={cn("h-[1.2rem] w-[1.2rem]")} />
        </Button>
      </div>
      <ThemeToggle />
    </div>
  );
}
