import { Bell, UserCircle } from "lucide-react";

export default function Navbar() {
  return (
    <div className="flex justify-between items-center bg-white p-4 shadow-sm">
      <h1 className="text-xl font-semibold">Rekap Materi Ajar</h1>

      <div className="flex items-center gap-4">
        <span className="text-gray-600">Selamat Datang, Dosen Shazil</span>
        <Bell className="text-gray-600" />
        <UserCircle className="text-gray-600" />
      </div>
    </div>
  );
}