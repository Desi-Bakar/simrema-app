"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ClipboardList } from "lucide-react";

type RekapRow = {
  id: string;
  tanggal: string;
  pertemuan: number;
  materi: string;
  tugas?: string | null;
  mataKuliah?: { id: string; nama: string };
};

function formatDate(d: string | Date) {
  const date = new Date(d);
  if (isNaN(date.getTime())) return "-";
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

export default function RekapTable() {
  const [data, setData] = useState<RekapRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const fetchRekap = async () => {
    try {
      const stored = localStorage.getItem("user");
      const user = stored ? JSON.parse(stored) : null;
      const res = await fetch(
        `/api/materi?email=${encodeURIComponent(user?.email || "")}&role=${user?.role || "DOSEN"}`
      );
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setData(json.data);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRekap();
  }, []);

  const handleDelete = async (id: string, pertemuan: number) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus materi pertemuan ${pertemuan}?`)) return;
    try {
      const res = await fetch(`/api/materi?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setData((prev) => prev.filter((item) => item.id !== id));
      } else {
        alert("Gagal menghapus materi.");
      }
    } catch {
      alert("Terjadi kesalahan koneksi.");
    }
  };

  const totalPages = Math.max(1, Math.ceil(data.length / pageSize));
  const rows = data.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="w-full space-y-6">
      {/* Header persis gambar */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-black tracking-tight">Rekap Mata Kuliah</h1>
        <Link
          href="/dashboard/rekap/tambah"
          className="inline-flex items-center justify-center bg-[#3BB75E] hover:bg-[#34a353] text-white font-semibold text-base px-6 py-2.5 rounded-xl transition shadow-xs"
        >
          <span>+ Tambah Materi</span>
        </Link>
      </div>

      {/* Tabel Cardbox persis gambar */}
      <div className="w-full bg-white border border-[#D5E1F9] rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.02)] overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-sm text-gray-500">Memuat rekap materi...</div>
        ) : data.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <ClipboardList size={32} className="mx-auto text-gray-400" />
            <h3 className="text-base font-semibold text-gray-700">Belum Ada Rekap Materi</h3>
            <p className="text-xs text-gray-500">Belum ada catatan pertemuan yang tersimpan.</p>
          </div>
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-white border-b border-[#E8EFFC] text-[#374151] font-semibold text-sm">
                  <th className="py-4 px-6 border-r border-[#E8EFFC] text-center w-[16%]">Tanggal</th>
                  <th className="py-4 px-6 border-r border-[#E8EFFC] text-center w-[20%]">Mata Kuliah</th>
                  <th className="py-4 px-6 border-r border-[#E8EFFC] text-center w-[16%]">Pertemuan</th>
                  <th className="py-4 px-6 border-r border-[#E8EFFC] text-center w-[24%]">Materi</th>
                  <th className="py-4 px-6 text-center w-[24%]">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8EFFC] text-[#4B5563] text-sm">
                {rows.map((item) => (
                  <tr key={item.id} className="hover:bg-[#F9FBFF] transition-colors">
                    <td className="py-4 px-6 border-r border-[#E8EFFC] text-center whitespace-nowrap text-[#4B5563]">
                      {formatDate(item.tanggal)}
                    </td>
                    <td className="py-4 px-6 border-r border-[#E8EFFC] text-center text-[#4B5563]">
                      {item.mataKuliah?.nama || "-"}
                    </td>
                    <td className="py-4 px-6 border-r border-[#E8EFFC] text-center text-[#4B5563]">
                      {item.pertemuan}
                    </td>
                    <td className="py-4 px-6 border-r border-[#E8EFFC] text-center text-[#4B5563]">
                      {item.materi}
                    </td>
                    <td className="py-4 px-6 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-2.5">
                        <Link
                          href={`/dashboard/rekap/id?matkulId=${item.mataKuliah?.id || ""}&matkulNama=${encodeURIComponent(item.mataKuliah?.nama || "")}`}
                          className="w-[74px] py-2 text-center text-xs font-semibold text-white bg-[#5068DE] hover:bg-[#4359cb] rounded-lg transition shadow-xs inline-block"
                        >
                          Lihat
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(item.id, item.pertemuan)}
                          className="w-[74px] py-2 text-center text-xs font-semibold text-white bg-[#D81A1A] hover:bg-[#bd1414] rounded-lg transition shadow-xs inline-block"
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination Footer di luar cardbox persis seperti gambar */}
      {!loading && data.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-1">
          <span className="text-gray-500 text-sm">
            Menampilkan {(page - 1) * pageSize + 1} hingga {Math.min(page * pageSize, data.length)} dari {data.length} data
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="w-10 h-10 flex items-center justify-center border border-[#CAD8F8] bg-white rounded-lg text-sm font-bold text-[#374151] hover:bg-gray-50 disabled:opacity-40 transition shadow-xs"
              aria-label="Previous Page"
            >
              &lt;
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-bold transition ${
                  page === p
                    ? "bg-[#5068DE] text-white shadow-xs"
                    : "border border-[#CAD8F8] bg-white text-[#374151] hover:bg-gray-50"
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className="w-10 h-10 flex items-center justify-center border border-[#CAD8F8] bg-white rounded-lg text-sm font-bold text-[#374151] hover:bg-gray-50 disabled:opacity-40 transition shadow-xs"
              aria-label="Next Page"
            >
              &gt;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


