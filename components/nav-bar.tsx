"use client";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Home, List, SettingsIcon } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
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
  const { name, email, image } = session?.user ?? {};
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
      <Popover>
        <PopoverTrigger>
          {image ? (
            <Image
              src={image}
              alt={name ?? "user-not-found"}
              width={32}
              height={32}
              className="rounded-full"
            />
          ) : (
            <SettingsIcon size={32} />
          )}
        </PopoverTrigger>
        <PopoverContent className="w-fit p-0">
          <div className="flex flex-col gap-3 p-4 items-end text-sm">
            <div>Hi, {name ? name.split(" ")[0] : "user not found"}!</div>
            <Separator />
            <button
              onClick={() =>
                signOut({
                  callbackUrl: "/",
                  redirect: true,
                })
              }
              className="text-right"
            >
              Sign out
            </button>
            <ThemeToggle useText />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
