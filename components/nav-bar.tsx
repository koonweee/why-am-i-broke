import { ThemeToggle } from "@/components/theme-toggle";

export default function NavBar() {
  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2">
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <ThemeToggle />
        <div className="hidden h-auto w-full grow rounded-md border md:block"></div>
      </div>
    </div>
  );
}
