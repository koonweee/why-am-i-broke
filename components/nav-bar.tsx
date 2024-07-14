import { ThemeToggle } from "@/components/theme-toggle";

export default function NavBar() {
  return (
    <div className="flex flex-row px-6 py-4">
      <ThemeToggle />
    </div>
  );
}
