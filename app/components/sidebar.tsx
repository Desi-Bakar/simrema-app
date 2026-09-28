"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  LayoutGrid,
  ClipboardList,
  GraduationCap,
  Users,
  User,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const MENUS = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutGrid },
  { name: "Rekap Materi Ajar", path: "/dashboard/rekap", icon: ClipboardList },
  { name: "Mata Kuliah", path: "/dashboard/matakuliah", icon: GraduationCap },
  { name: "Manajemen Pengguna", path: "/dashboard/users", icon: Users },
  { name: "Profil", path: "/dashboard/profil", icon: User },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("user");
    document.cookie = "simrema_user=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    router.push("/login");
  };

  return (
    <>
      {/* Tombol Hamburger di HP */}
      <button
        type="button"
        className="md:hidden fixed top-3 left-3 z-50 p-2 bg-[#5B6DD6] text-white rounded-md shadow"
        onClick={() => setOpen(!open)}
        aria-label="Toggle menu"
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Backdrop di HP */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`w-64 bg-[#5B6DD6] text-white flex flex-col justify-between shrink-0 min-h-screen ${
          open
            ? "fixed inset-y-0 left-0 z-50"
            : "max-md:hidden fixed inset-y-0 left-0 z-50 md:static"
        }`}
      >
        <div>
          {/* Logo Area */}
          <div className="pt-8 pb-6 px-6">
            <Link href="/dashboard" className="block w-40 mx-auto">
              <img
                src="/simremalogo.png"
                alt="SIMREMA"
                className="w-full h-auto object-contain"
              />
            </Link>
          </div>

          {/* Navigasi Menu */}
          <nav className="flex flex-col">
            {MENUS.map((menu) => {
              const isActive =
                menu.path === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname.startsWith(menu.path);
              const Icon = menu.icon;

              return (
                <Link
                  key={menu.path}
                  href={menu.path}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3.5 px-6 py-3.5 text-sm font-semibold transition-colors ${
                    isActive
                      ? "bg-[#8796EF] text-white"
                      : "text-white/90 hover:bg-white/10"
                  }`}
                >
                  <Icon size={22} className="shrink-0" />
                  <span>{menu.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Tombol Logout */}
        <div className="p-6">
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-3.5 text-sm font-semibold text-white/90 hover:text-white transition-colors"
          >
            <LogOut size={22} className="shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
