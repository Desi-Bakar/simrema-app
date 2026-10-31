"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Plus, ClipboardList } from "lucide-react";

type RekapRow = {
  id: string;
  tanggal: string;
  pertemuan: number;
  materi: string;
  tugas?: string | null;
  mataKuliah?: { id: string; nama: string };
};

export default function RekapTable() {
  const [data, setData] = useState<RekapRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const pageSize = 5;

  useEffect(() => {
    let ignore = false;
    async function fetchRekap() {
      try {
        const stored = localStorage.getItem("user");
        const user = stored ? JSON.parse(stored) : null;
        const res = await fetch(`/api/materi?email=${encodeURIComponent(user?.email || "")}&role=${user?.role || "DOSEN"}`);
        const json = await res.json();
        if (!ignore && json.success && Array.isArray(json.data)) {
          setData(json.data);
        }
      } catch {
        // ignore
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    fetchRekap();
    return () => {
      ignore = true;
    };
  }, []);

  const totalPages = Math.max(1, Math.ceil(data.length / pageSize));
  const rows = data.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#2D3748]">Rekap Mata Kuliah</h1>
          <p className="text-sm text-gray-500 mt-0.5">Daftar rekapitulasi materi ajar perkuliahan dosen</p>
        </div>
        <Link
          href="/dashboard/rekap/tambah"
          className="inline-flex items-center gap-2 bg-[#52C463] hover:bg-[#43ad53] text-white px-5 py-2.5 rounded-lg shadow-xs font-semibold text-sm transition"
        >
          <Plus size={18} />
          <span>Tambah Materi</span>
        </Link>
      </div>

      <div className="w-full bg-white border border-[#DCE4F0] rounded-2xl shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-sm text-gray-500">Memuat rekap materi...</div>
        ) : data.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <ClipboardList size={32} className="mx-auto text-gray-400" />
            <h3 className="text-base font-semibold text-gray-700">Belum Ada Rekap Materi</h3>
            <p className="text-xs text-gray-500">Belum ada catatan pertemuan yang tersimpan.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="bg-[#FAFBFD] border-b border-[#EDF2F7] text-[#2D3748] font-bold">
                    <th className="py-4 px-6 border-r border-[#EDF2F7]">Tanggal</th>
                    <th className="py-4 px-6 border-r border-[#EDF2F7]">Mata Kuliah</th>
                    <th className="py-4 px-6 border-r border-[#EDF2F7] text-center">Pertemuan</th>
                    <th className="py-4 px-6 border-r border-[#EDF2F7]">Materi</th>
                    <th className="py-4 px-6 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EDF2F7] text-[#4A5568]">
                  {rows.map((item) => (
                    <tr key={item.id} className="hover:bg-[#F8FAFC]">
                      <td className="py-4 px-6 border-r border-[#EDF2F7] font-medium text-gray-800">
                        {new Date(item.tanggal).toLocaleDateString("id-ID")}
                      </td>
                      <td className="py-4 px-6 border-r border-[#EDF2F7]">
                        {item.mataKuliah ? (
                          <Link
                            href={`/dashboard/rekap/id?matkulId=${item.mataKuliah.id}&matkulNama=${encodeURIComponent(item.mataKuliah.nama)}`}
                            className="text-[#5B6DD6] hover:underline font-medium"
                          >
                            {item.mataKuliah.nama}
                          </Link>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="py-4 px-6 border-r border-[#EDF2F7] text-center font-semibold text-gray-700">
                        {item.pertemuan}
                      </td>
                      <td className="py-4 px-6 border-r border-[#EDF2F7]">{item.materi}</td>
                      <td className="py-4 px-6 text-center whitespace-nowrap">
                        <Link
                          href={`/dashboard/rekap/edit?id=${item.id}&matkulId=${item.mataKuliah?.id || ""}&pertemuan=${item.pertemuan}&tanggal=${encodeURIComponent(new Date(item.tanggal).toISOString().split("T")[0])}&materi=${encodeURIComponent(item.materi)}&tugas=${encodeURIComponent(item.tugas || "")}`}
                          className="px-4 py-1.5 text-xs font-semibold text-white bg-[#5B6DD6] hover:bg-[#4858B8] rounded-lg transition inline-block shadow-xs"
                        >
                          Lihat / Edit
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col md:flex-row md:justify-between md:items-center px-6 py-4 bg-[#FAFBFD] border-t border-[#EDF2F7] gap-3">
              <span className="text-gray-600 text-xs md:text-sm">
                Menampilkan {(page - 1) * pageSize + 1} hingga {Math.min(page * pageSize, data.length)} dari {data.length} data
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={page === 1}
                  className="px-3 py-1.5 border border-[#CCD7ED] rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-100 disabled:opacity-40"
                >
                  Prev
                </button>
                <span className="text-xs font-bold text-gray-600 px-2">{page} / {totalPages}</span>
                <button
                  onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                  disabled={page === totalPages}
                  className="px-3 py-1.5 border border-[#CCD7ED] rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-100 disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}


