import { Bell, UserCircle } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center px-10 py-4 bg-white shadow">
      <div className="flex items-center space-x-2">
        <a href="/">
        <img src="/simremalogo.png" alt="logo" className="h-10" />
        </a>
      </div>
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-600">
          Selamat Datang Dosen
        </span>
        <img src="/profil.png" alt="logo" className="h-10" />
      </div>
    </nav>
  );
}