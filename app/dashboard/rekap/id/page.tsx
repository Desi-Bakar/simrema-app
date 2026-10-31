"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Share2, Plus, Trash2, Edit2, ClipboardList } from "lucide-react";

type RekapItem = {
  id: string;
  pertemuan: number;
  tanggal: string;
  materi: string;
  tugas?: string | null;
  mataKuliahId: string;
  mataKuliah?: { id: string; nama: string };
};

type MatkulItem = { id: string; nama: string };

function DetailRekapContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const queryMatkulId = searchParams.get("matkulId") || searchParams.get("id") || "";
  const queryMatkulNama = searchParams.get("matkulNama") || "";

  const [matkuls, setMatkuls] = useState<MatkulItem[]>([]);
  const [selectedMatkulId, setSelectedMatkulId] = useState<string>(queryMatkulId);
  const [selectedMatkulNama, setSelectedMatkulNama] = useState<string>(queryMatkulNama);
  const [data, setData] = useState<RekapItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      const user = stored ? JSON.parse(stored) : null;
      fetch(`/api/matakuliah?email=${encodeURIComponent(user?.email || "")}&role=${user?.role || "DOSEN"}`)
        .then((r) => r.json())
        .then((j) => {
          if (j.success && Array.isArray(j.data)) {
            setMatkuls(j.data);
            if (!queryMatkulId && j.data.length > 0) {
              setSelectedMatkulId(j.data[0].id);
              setSelectedMatkulNama(j.data[0].nama);
            } else if (queryMatkulId) {
              const f = j.data.find((m: MatkulItem) => m.id === queryMatkulId);
              if (f) setSelectedMatkulNama(f.nama);
            }
          }
        });
    } catch {}
  }, [queryMatkulId]);

  const loadMateri = useCallback(async (matkulId: string) => {
    setLoading(true);
    try {
      const stored = localStorage.getItem("user");
      const user = stored ? JSON.parse(stored) : null;
      const url = matkulId
        ? `/api/materi?mataKuliahId=${encodeURIComponent(matkulId)}&email=${encodeURIComponent(user?.email || "")}&role=${user?.role || "DOSEN"}`
        : `/api/materi?email=${encodeURIComponent(user?.email || "")}&role=${user?.role || "DOSEN"}`;
      const res = await fetch(url);
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setData(json.data);
        if (!selectedMatkulNama && json.data.length > 0 && json.data[0].mataKuliah?.nama) {
          setSelectedMatkulNama(json.data[0].mataKuliah.nama);
        }
      } else {
        setData([]);
      }
    } catch {
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [selectedMatkulNama]);

  useEffect(() => {
    if (selectedMatkulId) loadMateri(selectedMatkulId);
    else if (matkuls.length === 0) loadMateri("");
  }, [selectedMatkulId, matkuls.length, loadMateri]);

  const handleMatkulChange = (newId: string) => {
    setSelectedMatkulId(newId);
    const f = matkuls.find((m) => m.id === newId);
    setSelectedMatkulNama(f?.nama || "");
    router.replace(`/dashboard/rekap/id?matkulId=${newId}&matkulNama=${encodeURIComponent(f?.nama || "")}`);
  };

  const handleDelete = async (id: string, pertemuan: number) => {
    if (!confirm(`Hapus rekap materi pertemuan ${pertemuan}?`)) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/materi?id=${id}`, { method: "DELETE" });
      if (res.ok) setData((prev) => prev.filter((item) => item.id !== id));
    } finally {
      setDeletingId(null);
    }
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

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
              Rekap Materi Ajar : {selectedMatkulNama || "Mata Kuliah"}
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Daftar pertemuan, materi dan penugasan yang telah dilaksanakan
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {matkuls.length > 1 && (
            <select
              value={selectedMatkulId}
              onChange={(e) => handleMatkulChange(e.target.value)}
              className="px-3 py-2 border border-[#CCD7ED] rounded-lg text-sm bg-white text-gray-700 font-medium"
            >
              {matkuls.map((m) => (
                <option key={m.id} value={m.id}>{m.nama}</option>
              ))}
            </select>
          )}
          <Link
            href={`/dashboard/rekap/tambah?matkulId=${selectedMatkulId}&matkulNama=${encodeURIComponent(selectedMatkulNama)}`}
            className="inline-flex items-center gap-2 bg-[#52C463] hover:bg-[#43ad53] text-white px-5 py-2.5 rounded-lg font-semibold text-sm transition shadow-xs whitespace-nowrap"
          >
            <Plus size={18} />
            <span>Tambah Materi</span>
          </Link>
        </div>
      </div>

      {/* Tabel Cardbox */}
      <div className="bg-white rounded-2xl border border-[#DCE4F0] overflow-hidden shadow-xs">
        {loading ? (
          <div className="p-10 text-center text-sm text-gray-500">Memuat rekap materi...</div>
        ) : data.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <ClipboardList size={32} className="mx-auto text-gray-400" />
            <h3 className="text-base font-semibold text-gray-700">Belum Ada Rekap Materi</h3>
            <p className="text-xs text-gray-500">
              Belum ada catatan materi untuk mata kuliah ini. Silakan klik Tambah Materi.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FAFBFD] border-b border-[#EDF2F7] text-[#2D3748] text-sm font-bold">
                  <th className="py-4 px-6 border-r border-[#EDF2F7] text-center w-24">Pertemuan</th>
                  <th className="py-4 px-6 border-r border-[#EDF2F7]">Tanggal</th>
                  <th className="py-4 px-6 border-r border-[#EDF2F7]">Materi</th>
                  <th className="py-4 px-6 border-r border-[#EDF2F7]">Tugas</th>
                  <th className="py-4 px-6 text-center w-36">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EDF2F7] text-sm text-[#4A5568]">
                {data.map((item) => (
                  <tr key={item.id} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="py-4 px-6 border-r border-[#EDF2F7] text-center font-semibold text-gray-700">
                      {item.pertemuan}
                    </td>
                    <td className="py-4 px-6 border-r border-[#EDF2F7] whitespace-nowrap">
                      {new Date(item.tanggal).toLocaleDateString("id-ID")}
                    </td>
                    <td className="py-4 px-6 border-r border-[#EDF2F7]">{item.materi}</td>
                    <td className="py-4 px-6 border-r border-[#EDF2F7]">{item.tugas || "-"}</td>
                    <td className="py-4 px-6 text-center whitespace-nowrap">
                      <div className="inline-flex items-center gap-2">
                        <Link
                          href={`/dashboard/rekap/edit?id=${item.id}&matkulId=${selectedMatkulId || item.mataKuliahId}&pertemuan=${item.pertemuan}&tanggal=${encodeURIComponent(new Date(item.tanggal).toISOString().split("T")[0])}&materi=${encodeURIComponent(item.materi)}&tugas=${encodeURIComponent(item.tugas || "")}`}
                          className="bg-[#5B6DD6] hover:bg-[#4858B8] text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition inline-flex items-center gap-1 shadow-xs"
                        >
                          <Edit2 size={13} />
                          <span>Edit</span>
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(item.id, item.pertemuan)}
                          disabled={deletingId === item.id}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition disabled:opacity-40"
                          title="Hapus"
                        >
                          <Trash2 size={15} />
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

      {/* Footer Actions */}
      <div className="flex justify-end pt-2">
        <button
          type="button"
          onClick={handleShare}
          className="inline-flex items-center gap-2 border border-[#CCD7ED] bg-white hover:bg-gray-50 text-gray-700 px-6 py-2.5 rounded-lg text-sm font-semibold transition shadow-xs"
        >
          <Share2 size={16} />
          <span>{copied ? "Link Tersalin!" : "Bagikan"}</span>
        </button>
      </div>

      {/* Footer */}
      <footer className="text-center text-xs md:text-sm text-gray-500 pt-4">
        @2026 | Aplikasi Rekap Materi Mengajar Dosen.
      </footer>
    </div>
  );
}

export default function DetailRekap() {
  return (
    <Suspense fallback={<div className="p-8 text-sm text-gray-500">Memuat halaman...</div>}>
      <DetailRekapContent />
    </Suspense>
  );
}
