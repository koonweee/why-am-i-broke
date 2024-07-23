"use client";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Home, List } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";
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
  const { data: session } = useSession();
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
      <div className="flex flex-row gap-4 items-center">
        <div>
          {session ? (
            <Popover>
              <PopoverTrigger>
                <div className="text-sm">
                  Hi, {session.user?.name?.split(" ")[0]}
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-fit p-0">
                <Button
                  variant="ghost"
                  onClick={() =>
                    signOut({
                      callbackUrl: "/",
                      redirect: true,
                    })
                  }
                >
                  Sign out
                </Button>
              </PopoverContent>
            </Popover>
          ) : (
            <Button variant="outline" size="default" onClick={() => signIn()}>
              Sign in
            </Button>
          )}
        </div>
        <ThemeToggle />
      </div>
    </div>
  );
}
