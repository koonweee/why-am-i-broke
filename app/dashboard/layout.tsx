import HeaderBar from "@/components/header-bar";
import NavBar from "@/components/nav-bar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <HeaderBar />
      <div className="flex-grow px-3 py-2 md:overflow-y-auto md:p-12 overflow-scroll">
        {children}
      </div>
      <div className="fixed bottom-0 w-full">
        <NavBar />
      </div>
    </div>
  );
}
