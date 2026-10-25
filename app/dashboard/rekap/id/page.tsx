"use client";

import Link from "next/link";
import { ArrowLeft, Share2, Plus } from "lucide-react";

export default function DetailRekap() {
  const data = [
    {
      pertemuan: 1,
      tanggal: "01/01/2026",
      materi: "IP Address",
      tugas: "IP Address",
    },
    {
      pertemuan: 2,
      tanggal: "01/01/2026",
      materi: "Routing",
      tugas: "Routing",
    },
    {
      pertemuan: 3,
      tanggal: "01/01/2026",
      materi: "IP Static",
      tugas: "IP Static",
    },
    {
      pertemuan: 4,
      tanggal: "01/01/2026",
      materi: "IP Dinamic",
      tugas: "IP Dinamic",
    },
    {
      pertemuan: 5,
      tanggal: "01/01/2026",
      materi: "OSI Layer",
      tugas: "OSI Layer",
    },
  ];

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/rekap"
            className="p-2 bg-white border border-[#DCE4F0] rounded-lg hover:bg-gray-50 text-gray-600 transition shadow-xs"
            aria-label="Kembali ke Rekap"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#2D3748]">
              Rekap Materi Ajar : MikroTik
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Daftar pertemuan, materi dan penugasan yang telah dilaksanakan
            </p>
          </div>
        </div>

        <Link
          href="/dashboard/rekap/tambah"
          className="inline-flex items-center gap-2 bg-[#52C463] hover:bg-[#43ad53] text-white px-5 py-2.5 rounded-lg font-semibold text-sm transition shadow-xs"
        >
          <Plus size={18} />
          <span>Tambah Materi</span>
        </Link>
      </div>

      {/* Tabel Cardbox */}
      <div className="bg-white rounded-2xl border border-[#DCE4F0] overflow-hidden shadow-xs">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FAFBFD] border-b border-[#EDF2F7] text-[#2D3748] text-sm font-bold">
                <th className="py-4 px-6 border-r border-[#EDF2F7] text-center w-24">
                  Pertemuan
                </th>
                <th className="py-4 px-6 border-r border-[#EDF2F7]">Tanggal</th>
                <th className="py-4 px-6 border-r border-[#EDF2F7]">Materi</th>
                <th className="py-4 px-6 border-r border-[#EDF2F7]">Tugas</th>
                <th className="py-4 px-6 text-center w-28">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EDF2F7] text-sm text-[#4A5568]">
              {data.map((item, index) => (
                <tr key={index} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="py-4 px-6 border-r border-[#EDF2F7] text-center font-semibold text-gray-700">
                    {item.pertemuan}
                  </td>
                  <td className="py-4 px-6 border-r border-[#EDF2F7] whitespace-nowrap">
                    {item.tanggal}
                  </td>
                  <td className="py-4 px-6 border-r border-[#EDF2F7]">
                    {item.materi}
                  </td>
                  <td className="py-4 px-6 border-r border-[#EDF2F7]">
                    {item.tugas}
                  </td>
                  <td className="py-4 px-6 text-center whitespace-nowrap">
                    <Link
                      href={`/dashboard/rekap/edit?pertemuan=${item.pertemuan}&tanggal=${encodeURIComponent(item.tanggal)}&materi=${encodeURIComponent(item.materi)}`}
                      className="bg-[#5B6DD6] hover:bg-[#4858B8] text-white px-5 py-2 rounded-lg text-xs font-semibold transition inline-block shadow-xs"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex justify-end pt-2">
        <button
          type="button"
          onClick={() => alert("Link rekap berhasil disalin!")}
          className="inline-flex items-center gap-2 border border-[#CCD7ED] bg-white hover:bg-gray-50 text-gray-700 px-6 py-2.5 rounded-lg text-sm font-semibold transition shadow-xs"
        >
          <Share2 size={16} />
          <span>Bagikan</span>
        </button>
      </div>

      {/* Footer */}
      <footer className="text-center text-xs md:text-sm text-gray-500 pt-4">
        @2026 | Aplikasi Rekap Materi Mengajar Dosen.
      </footer>
    </div>
  );
}
