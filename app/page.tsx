"use client";
import { providerMap } from "@/auth";
import { Button } from "@/components/ui/button";
import { CircleDollarSignIcon } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { data: session } = useSession();

  const { name, email, image } = session?.user || {};
  const router = useRouter();
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4">
      <CircleDollarSignIcon size={48} />
      <div className="flex flex-row gap-2 text-4xl font-bold items-center">
        why-am-i-broke
      </div>
      {session && (
        <div className="flex flex-col items-center gap-4">
          <p>
            welcome back, <strong>{name}</strong>
          </p>
          <div className="flex flex-row items-center gap-4">
            <Button onClick={() => router.push("/dashboard")} variant="default">
              Open app
            </Button>
            <Button onClick={() => signOut()} variant="secondary">
              Sign out
            </Button>
          </div>
        </div>
      )}
      {!session && (
        <div className="flex flex-col gap-2">
          {Object.values(providerMap).map((provider) => (
            <form
              key={provider.id}
              action={async () => {
                try {
                  await signIn(provider.id);
                } catch (error) {
                  // Otherwise if a redirects happens NextJS can handle it
                  // so you can just re-thrown the error and let NextJS handle it.
                  // Docs:
                  // https://nextjs.org/docs/app/api-reference/functions/redirect#server-component
                  throw error;
                }
              }}
            >
              <button type="submit">
                <span>Sign in with {provider.name}</span>
              </button>
            </form>
          ))}
        </div>
      )}
    </main>
  );
}
