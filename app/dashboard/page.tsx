import Sidebar from "../components/sidebar";
import { Bell, User } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="flex">

      {/* Sidebar */}
      <Sidebar />

      {/* Content */}
      <div className="flex-1 p-6 bg-gray-100 min-h-screen">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Dashboard</h1>

          <div className="flex items-center gap-4">
            <p className="text-sm text-gray-600">
              Selamat Datang, Dosen Shazil
            </p>

            <Bell className="cursor-pointer text-gray-600" size={20} />
            <div className="bg-gray-300 rounded-full p-2 cursor-pointer">
              <User size={18} />
            </div>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          
          <div className="bg-white p-5 rounded-xl shadow-sm flex items-center gap-4">
            <div className="bg-yellow-100 p-3 rounded-lg">
              📄
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total Materi</p>
              <h2 className="text-xl font-bold">12</h2>
              <div className="w-20 h-1 bg-indigo-500 mt-2 rounded"></div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm flex items-center gap-4">
            <div className="bg-green-100 p-3 rounded-lg">
              📚
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total Mata Kuliah</p>
              <h2 className="text-xl font-bold">12</h2>
              <div className="w-20 h-1 bg-indigo-500 mt-2 rounded"></div>
            </div>
          </div>

        </div>

        {/* Table */}
        <div className="bg-white p-6 rounded-xl shadow-sm">

          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="font-semibold">Materi Terakhir</p>
              <p className="text-sm text-gray-500">
                Menampilkan 5 materi terakhir
              </p>
            </div>

            <button className="text-indigo-600 text-sm hover:underline">
              Lihat Semua Materi
            </button>
          </div>

          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-500 border-b">
                <th className="text-left py-2">Tanggal</th>
                <th className="text-left py-2">Mata Kuliah</th>
                <th className="text-left py-2">Pertemuan</th>
                <th className="text-left py-2">Materi</th>
              </tr>
            </thead>

            <tbody>
              <tr className="border-b hover:bg-gray-50">
                <td className="py-3">01/01/2026</td>
                <td>MikroTik</td>
                <td>3</td>
                <td className="text-indigo-600">IP Address</td>
              </tr>

              <tr className="border-b hover:bg-gray-50">
                <td className="py-3">01/01/2026</td>
                <td>CISCO</td>
                <td>6</td>
                <td>Routing</td>
              </tr>

              <tr className="border-b hover:bg-gray-50">
                <td className="py-3">01/01/2026</td>
                <td>Linux Server</td>
                <td>9</td>
                <td>Perintah Dasar CLI</td>
              </tr>

              <tr className="border-b hover:bg-gray-50">
                <td className="py-3">01/01/2026</td>
                <td>Docker</td>
                <td>4</td>
                <td>Container</td>
              </tr>

              <tr className="hover:bg-gray-50">
                <td className="py-3">01/01/2026</td>
                <td>Python</td>
                <td>6</td>
                <td>Library Kunci</td>
              </tr>
            </tbody>
          </table>

          {/* Footer */}
          <p className="text-center text-xs text-gray-400 mt-6">
            ©2025 | Aplikasi Rekap Materi Mengajar Dosen.
          </p>

        </div>

      </div>
    </div>
  );
}