"use client";

import Link from "next/link";
import { Trash2, User } from "lucide-react";

export type Matkul = {
  id: string;
  kode?: string | null;
  nama: string;
  sks?: number | null;
  dosenEmail: string;
  dosen?: { profilDosen?: { nama: string } | null };
  _count?: { rekapMateri: number };
};

interface MatkulTableProps {
  list: Matkul[];
  isAdmin: boolean;
  onDelete: (id: string, nama: string) => void;
}

export default function MatkulTable({ list, isAdmin, onDelete }: MatkulTableProps) {
  return (
    <div className="overflow-x-auto w-full">
      <table className="w-full text-left text-sm border-collapse">
        <thead>
          <tr className="bg-[#FAFBFD] border-b border-[#EDF2F7] text-[#2D3748] font-bold">
            <th className="py-4 px-6 border-r border-[#EDF2F7]">Kode</th>
            <th className="py-4 px-6 border-r border-[#EDF2F7]">Mata Kuliah</th>
            <th className="py-4 px-6 border-r border-[#EDF2F7] text-center">SKS</th>
            <th className="py-4 px-6 border-r border-[#EDF2F7]">Dosen Pengampu</th>
            <th className="py-4 px-6 border-r border-[#EDF2F7] text-center">Rekap</th>
            <th className="py-4 px-6 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#EDF2F7] text-[#4A5568]">
          {list.map((m) => (
            <tr key={m.id} className="hover:bg-[#F8FAFC]">
              <td className="py-4 px-6 border-r border-[#EDF2F7] font-semibold text-gray-800">{m.kode || "-"}</td>
              <td className="py-4 px-6 border-r border-[#EDF2F7] font-medium text-gray-900">{m.nama}</td>
              <td className="py-4 px-6 border-r border-[#EDF2F7] text-center">{m.sks || 3}</td>
              <td className="py-4 px-6 border-r border-[#EDF2F7]">
                <div className="flex items-center gap-2">
                  <User size={14} className="text-gray-400 shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-800 text-xs">{m.dosen?.profilDosen?.nama || "Dosen"}</p>
                    <p className="text-[11px] text-gray-500">{m.dosenEmail}</p>
                  </div>
                </div>
              </td>
              <td className="py-4 px-6 border-r border-[#EDF2F7] text-center font-bold text-[#5B6DD6]">
                {m._count?.rekapMateri ?? 0}
              </td>
              <td className="py-4 px-6 text-center whitespace-nowrap">
                <div className="inline-flex items-center gap-2">
                  <Link
                    href={`/dashboard/rekap/tambah?matkulId=${m.id}&matkulNama=${encodeURIComponent(m.nama)}`}
                    className="px-3 py-1 text-xs font-semibold text-white bg-[#52C463] hover:bg-[#43ad53] rounded-lg shadow-xs"
                  >
                    + Rekap
                  </Link>
                  {isAdmin && (
                    <button
                      onClick={() => onDelete(m.id, m.nama)}
                      className="p-1 text-red-500 hover:bg-red-50 rounded"
                      title="Hapus"
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
