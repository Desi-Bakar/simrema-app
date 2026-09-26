"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  Users,
  User,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        const parsed = JSON.parse(stored);
        setUserRole(parsed.role || null);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    document.cookie = "simrema_user=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    router.push("/login");
  };

  const menus = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Rekap Materi Ajar", path: "/dashboard/rekap", icon: BookOpen },
    { name: "Mata Kuliah", path: "/dashboard/matakuliah", icon: GraduationCap },
    { name: "Manajemen Pengguna", path: "/dashboard/users", icon: Users },
    { name: "Profil", path: "/dashboard/profil", icon: User },
  ];

  return (
    <div>
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-indigo-600 text-white rounded-lg"
        onClick={() => setOpen(true)}
      >
        <Menu size={20} />
      </button>

      <aside
        className={`fixed top-0 left-0 h-screen w-64 bg-gradient-to-b from-indigo-600 to-indigo-700 text-white p-5 shadow-lg transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:static flex flex-col justify-between`}
      >
        <div>
          <div className="flex justify-between items-center mb-10">
            <Link href="/dashboard" className="block">
              <img src="/simremalogo.png" alt="Simrema Logo" className="h-16" />
            </Link>
            <button
              className="md:hidden text-white"
              onClick={() => setOpen(false)}
            >
              <X size={20} />
            </button>
          </div>

          <nav className="space-y-2">
            {menus.map((menu, index) => {
              const isActive = pathname === menu.path || (menu.path !== "/dashboard" && pathname.startsWith(menu.path));
              const Icon = menu.icon;
              return (
                <Link
                  key={index}
                  href={menu.path}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                    isActive ? "bg-white/20 font-semibold" : "hover:bg-white/10 text-white/80 hover:text-white"
                  }`}
                  onClick={() => setOpen(false)}
                >
                  <Icon size={18} />
                  <span>{menu.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 p-3 rounded-lg bg-white/10 hover:bg-white/20 text-white/90 hover:text-white transition-all duration-200"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </div>
  );
}
