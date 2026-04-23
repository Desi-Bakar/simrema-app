"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  ShoppingCart,
  User,
  LogOut,
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const menus = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Rekap Materi Ajar",
      path: "/dashboard/rekap",
      icon: BookOpen,
    },
    {
      name: "Pemesanan",
      path: "/dashboard/pemesanan",
      icon: ShoppingCart,
    },
    {
      name: "Profil",
      path: "/dashboard/profil",
      icon: User,
    },
  ];

  return (
    <aside className="w-64 min-h-screen flex flex-col justify-between bg-gradient-to-b from-indigo-600 to-indigo-700 text-white p-5 shadow-lg">

      {/* ===== TOP ===== */}
      <div>
        {/* Logo */}
        <Link href="/" className="block mb-10">
          <img
            src="/simremalogo.png"
            alt="Simrema Logo"
            className="h-10"
          />
        </Link>

        {/* Menu */}
        <nav className="space-y-2">
          {menus.map((menu, index) => {
            const isActive = pathname === menu.path;
            const Icon = menu.icon;

            return (
              <Link
                key={index}
                href={menu.path}
                className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200
                ${
                  isActive
                    ? "bg-white/20"
                    : "hover:bg-white/10"
                }`}
              >
                <Icon size={18} />
                <span>{menu.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* ===== BOTTOM ===== */}
      <button
        className="flex items-center justify-center gap-2 p-3 rounded-lg bg-white/20 hover:bg-white/30 transition-all duration-200"
      >
        <LogOut size={18} />
        <span>Logout</span>
      </button>
    </aside>
  );
}