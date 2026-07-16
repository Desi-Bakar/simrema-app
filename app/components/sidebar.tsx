"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  ShoppingCart,
  User,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const menus = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Rekap Materi Ajar", path: "/dashboard/rekap", icon: BookOpen },
    { name: "Pemesanan", path: "/dashboard/pemesanan", icon: ShoppingCart },
    { name: "Profil", path: "/dashboard/profile", icon: User },
  ];

  return (
    <div>
      {/* Tombol Hamburger (hanya di HP) */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-indigo-600 text-white rounded-lg"
        onClick={() => setOpen(true)}
      >
        <Menu size={20} />
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen w-64 bg-gradient-to-b from-indigo-600 to-indigo-700 text-white p-5 shadow-lg transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:static`}
      >
        {/* Tombol Close (hanya di HP) */}
        <button
          className="md:hidden absolute top-4 right-4 text-white"
          onClick={() => setOpen(false)}
        >
          <X size={20} />
        </button>

        {/* Logo */}
        <Link href="/" className="block mb-10">
          <img src="/simremalogo.png" alt="Simrema Logo" className="h-20" />
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
                className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                  isActive ? "bg-white/20" : "hover:bg-white/10"
                }`}
                onClick={() => setOpen(false)} // tutup sidebar setelah klik
              >
                <Icon size={18} />
                <span>{menu.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <button className="flex items-center justify-center gap-2 p-3 mt-10 rounded-lg bg-white/20 hover:bg-white/30 transition-all duration-200">
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </aside>
    </div>
  );
}
