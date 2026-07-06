import { Bell, Menu } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center w-full px-4 md:px-10 py-3 bg-white shadow">
      {/* Logo */}
      <a href="/">
        <img src="/simremalogo.png" alt="logo" className="h-8 md:h-10" />
      </a>

      {/* Desktop View */}
      <div className="hidden md:flex items-center space-x-4">
        <span className="text-gray-600">Selamat Datang Dosen</span>
        <Bell size={22} className="text-gray-600" />
        <img src="/profil.png" alt="profil" className="h-9 w-9 rounded-full border" />
      </div>

      {/* Mobile View */}
      <div className="flex md:hidden items-center space-x-3">
        <Menu size={22} className="text-gray-600" />
        <img src="/profil.png" alt="profil" className="h-8 w-8 rounded-full border" />
      </div>
    </nav>
  );
}
