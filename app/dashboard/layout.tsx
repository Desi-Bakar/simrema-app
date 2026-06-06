import { Bell, User } from "lucide-react";
import Sidebar from "../components/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">

      <Sidebar />

      <div className="basis-full">
        <header className=" bg-white shadow px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Dashboard</h1>
            <p className="text-sm text-gray-600 mt-1">Selamat datang, Dosen Shazil</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm text-gray-700 shadow-sm hover:shadow-md transition-shadow">
              <Bell size={18} /> Notifikasi
            </button>
            <div className="bg-gray-300 rounded-full p-3 cursor-pointer shadow-sm">
              <User size={18} />
            </div>
          </div>
        </header>
        <main className="bg-gray-100 p-6">
          {children}
        </main>
      </div>
      
    </div>

  );
}