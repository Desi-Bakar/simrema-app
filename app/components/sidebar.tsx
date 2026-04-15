import { LayoutDashboard, BookOpen, ShoppingCart, User, LogOut } from "lucide-react";

export default function Sidebar() {
  return (
    <div className="w-64 min-h-screen flex flex-col justify-between 
    bg-gradient-to-b from-indigo-600 to-indigo-700 text-white p-5">

      {/* TOP */}
      <div>
        {/* Logo */}
        {/* <h1 className="text-2xl font-bold mb-10 tracking-wide">
          simrema
        </h1> */}
        <a href="/">
          <img src="/simremalogo.png" alt="logo" className="h-10" />
          </a>

        {/* Menu */}
        <ul className="space-y-3">
          <li className="flex items-center gap-3 bg-white/20 p-3 rounded-lg cursor-pointer">
            <LayoutDashboard size={18} />
            Dashboard
          </li>

          <li className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 cursor-pointer transition">
            <BookOpen size={18} />
            Rekap Materi Ajar
          </li>

          <li className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 cursor-pointer transition">
            <ShoppingCart size={18} />
            Pemesanan
          </li>

          <li className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 cursor-pointer transition">
            <User size={18} />
            Profil
          </li>
        </ul>
      </div>

      {/* BOTTOM */}
      <button className="flex items-center justify-center gap-2 
      bg-white/20 hover:bg-white/30 transition p-3 rounded-lg">
        <LogOut size={18} />
        Logout
      </button>
    </div>
  );
}