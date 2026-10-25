"use client";

import Link from "next/link";
import Image from "next/image";
import { Bell } from "lucide-react";
import { useSyncExternalStore } from "react";

function getStoredUserName() {
  if (typeof window === "undefined") return "Pengguna";
  try {
    const stored = localStorage.getItem("user");
    if (!stored) return "Pengguna";
    const parsed = JSON.parse(stored);
    return parsed?.nama || "Pengguna";
  } catch {
    return "Pengguna";
  }
}

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

export default function Navbar() {
  const userName = useSyncExternalStore(subscribe, getStoredUserName, () => "Pengguna");

  return (
    <nav className="flex justify-between items-center w-full px-4 md:px-10 py-3 bg-white shadow-sm border-b">
      <Link href="/dashboard">
        <Image
          src="/simremalogo.png"
          alt="logo"
          width={130}
          height={36}
          className="h-8 md:h-10 w-auto object-contain"
          priority
        />
      </Link>

      <div className="flex items-center space-x-4">
        <span className="text-gray-600 text-sm hidden sm:inline">
          Selamat Datang, <strong>{userName}</strong>
        </span>
        <button className="text-gray-500 hover:text-gray-700 p-1" aria-label="Notifikasi">
          <Bell size={20} />
        </button>
        <Link href="/dashboard/profil" className="hover:opacity-80 transition">
          <Image
            src="/profil.png"
            alt="profil"
            width={36}
            height={36}
            className="h-9 w-9 rounded-full border border-indigo-200 object-cover"
          />
        </Link>
      </div>
    </nav>
  );
}

