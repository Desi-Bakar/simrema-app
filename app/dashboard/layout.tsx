import { Bell, User } from "lucide-react";
import Sidebar from "../components/sidebar";
import Navbar from "../components/navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex w-full max-w-full min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Content */}
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="bg-gray-100 p-4 md:p-12 w-full max-w-full overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}