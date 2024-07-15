"use client";
import { usePathname, useRouter } from "next/navigation";

const BASE_HEADER_TEXT = "cash money $";

export default function HeaderBar() {
  const pathname = usePathname();
  const headerSubtext = getHeaderSubtextFromPathname(pathname);
  const headerText = [BASE_HEADER_TEXT, headerSubtext]
    .filter(Boolean)
    .join(" - ");
  return (
    <div className="flex justify-between px-6 py-4 items-center bg-background">
      <h1 className={`text-base md:text-2xl`}>{headerText}</h1>
    </div>
  );
}

function getHeaderSubtextFromPathname(pathname: string) {
  switch (pathname) {
    case "/dashboard/transactions":
      return "transactions";
    case "/dashboard/transactions/edit":
      return "edit transaction";
    default:
      return undefined;
  }
}
