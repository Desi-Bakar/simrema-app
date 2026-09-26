"use client";

import Link from "next/link";
import { Bell } from "lucide-react";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [userName, setUserName] = useState("Pengguna");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.nama) setUserName(parsed.nama);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  return (
    <nav className="flex justify-between items-center w-full px-4 md:px-10 py-3 bg-white shadow-sm border-b">
      <Link href="/dashboard">
        <img src="/simremalogo.png" alt="logo" className="h-8 md:h-10" />
      </Link>

      <div className="flex items-center space-x-4">
        <span className="text-gray-600 text-sm hidden sm:inline">
          Selamat Datang, <strong>{userName}</strong>
        </span>
        <button className="text-gray-500 hover:text-gray-700 p-1">
          <Bell size={20} />
        </button>
        <Link href="/dashboard/profil" className="hover:opacity-80 transition">
          <img
            src="/profil.png"
            alt="profil"
            className="h-9 w-9 rounded-full border border-indigo-200 object-cover"
          />
        </Link>
      </div>
    </nav>
  );
}
