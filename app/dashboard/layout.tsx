import HeaderBar from "@/components/header-bar";
import NavBar from "@/components/nav-bar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-[100dvh] flex-col md:flex-row">
      <HeaderBar />
      <div className="flex-grow px-3 py-2 md:overflow-y-auto md:p-12 overflow-scroll">
        {children}
      </div>
      <NavBar />
    </div>
  );
}
