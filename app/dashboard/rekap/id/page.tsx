
"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Share2,
  Plus,
  Trash2,
  Edit2,
  ClipboardList,
  Printer,
  FileDown,
} from "lucide-react";

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

  const queryMatkulId =
    searchParams.get("matkulId") || searchParams.get("id") || "";
  const queryMatkulNama = searchParams.get("matkulNama") || "";

  const [matkuls, setMatkuls] = useState<MatkulItem[]>([]);
  const [selectedMatkulId, setSelectedMatkulId] =
    useState<string>(queryMatkulId);
  const [selectedMatkulNama, setSelectedMatkulNama] =
    useState<string>(queryMatkulNama);
  const [data, setData] = useState<RekapItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      const user = stored ? JSON.parse(stored) : null;

      fetch(
        `/api/matakuliah?email=${encodeURIComponent(
          user?.email || ""
        )}&role=${user?.role || "DOSEN"}`
      )
        .then((r) => r.json())
        .then((j) => {
          if (j.success && Array.isArray(j.data)) {
            setMatkuls(j.data);

            if (!queryMatkulId && j.data.length > 0) {
              setSelectedMatkulId(j.data[0].id);
              setSelectedMatkulNama(j.data[0].nama);
            } else if (queryMatkulId) {
              const f = j.data.find(
                (m: MatkulItem) => m.id === queryMatkulId
              );
              if (f) setSelectedMatkulNama(f.nama);
            }
          }
        });
    } catch {}
  }, [queryMatkulId]);

  const loadMateri = useCallback(
    async (matkulId: string) => {
      setLoading(true);

      try {
        const stored = localStorage.getItem("user");
        const user = stored ? JSON.parse(stored) : null;

        const params = new URLSearchParams();
        if (matkulId) {
          params.append("mataKuliahId", matkulId);
        }
        // Admin: fetch semua. Dosen: filter by email
        if (user?.role === "DOSEN" && user?.email) {
          params.append("email", user.email);
        }
        params.append("role", user?.role || "DOSEN");

        const url = `/api/materi?${params.toString()}`;
        const res = await fetch(url);
        const json = await res.json();

        if (json.success && Array.isArray(json.data)) {
          setData(json.data);

          if (
            !selectedMatkulNama &&
            json.data.length > 0 &&
            json.data[0].mataKuliah?.nama
          ) {
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
    },
    [selectedMatkulNama]
  );

  useEffect(() => {
    if (selectedMatkulId) loadMateri(selectedMatkulId);
    else if (matkuls.length === 0) loadMateri("");
  }, [selectedMatkulId, matkuls.length, loadMateri]);

  const handleMatkulChange = (newId: string) => {
    setSelectedMatkulId(newId);

    const f = matkuls.find((m) => m.id === newId);
    setSelectedMatkulNama(f?.nama || "");

    router.replace(
      `/dashboard/rekap/id?matkulId=${newId}&matkulNama=${encodeURIComponent(
        f?.nama || ""
      )}`
    );
  };

  const handleDelete = async (id: string, pertemuan: number) => {
    if (!confirm(`Hapus rekap materi pertemuan ${pertemuan}?`)) return;

    setDeletingId(id);

    try {
      const res = await fetch(`/api/materi?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setData((prev) => prev.filter((item) => item.id !== id));
      }
    } finally {
      setDeletingId(null);
    }
  };

  // Membuka modal Bagikan
  const handleShare = () => {
    setShowShareModal(true);
  };

  // Download PDF
  const handleDownloadPDF = () => {
    setShowShareModal(false);

    setTimeout(() => {
      window.print();
    }, 500);
  };

  // Print langsung
  const handlePrint = () => {
    setShowShareModal(false);

    setTimeout(() => {
      window.print();
    }, 500);
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
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
                <option key={m.id} value={m.id}>
                  {m.nama}
                </option>
              ))}
            </select>
          )}

          <Link
            href={`/dashboard/rekap/tambah?matkulId=${selectedMatkulId}&matkulNama=${encodeURIComponent(
              selectedMatkulNama
            )}`}
            className="inline-flex items-center gap-2 bg-[#52C463] hover:bg-[#43ad53] text-white px-5 py-2.5 rounded-lg font-semibold text-sm transition shadow-xs whitespace-nowrap"
          >
            <Plus size={18} />
            <span>Tambah Materi</span>
          </Link>
        </div>
      </div>

      {/* AREA YANG AKAN DICETAK */}
      <div id="rekap-print-area">
        {/* Judul khusus laporan cetak */}
        <div className="hidden print:block mb-6">
          <h1 className="text-xl font-bold text-black text-center">
            REKAP MATERI AJAR
          </h1>

          <p className="text-center text-black mt-2">
            Mata Kuliah: {selectedMatkulNama || "Mata Kuliah"}
          </p>

          <p className="text-center text-sm text-black mt-1">
            SIMREMA - Sistem Rekap Materi Ajar
          </p>
        </div>

        {/* Tabel Cardbox */}
        <div className="bg-white rounded-2xl border border-[#DCE4F0] overflow-hidden shadow-xs print:border-0 print:rounded-none">
          {loading ? (
            <div className="p-10 text-center text-sm text-gray-500">
              Memuat rekap materi...
            </div>
          ) : data.length === 0 ? (
            <div className="p-12 text-center space-y-2">
              <ClipboardList
                size={32}
                className="mx-auto text-gray-400"
              />

              <h3 className="text-base font-semibold text-gray-700">
                Belum Ada Rekap Materi
              </h3>

              <p className="text-xs text-gray-500">
                Belum ada catatan materi untuk mata kuliah ini.
                Silakan klik Tambah Materi.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse print:w-full">
                <thead>
                  <tr className="bg-[#FAFBFD] border-b border-[#EDF2F7] text-[#2D3748] text-sm font-bold print:bg-gray-100">
                    <th className="py-4 px-6 border-r border-[#EDF2F7] text-center w-24 print:border print:border-black print:text-black">
                      Pertemuan
                    </th>

                    <th className="py-4 px-6 border-r border-[#EDF2F7] print:border print:border-black print:text-black">
                      Tanggal
                    </th>

                    <th className="py-4 px-6 border-r border-[#EDF2F7] print:border print:border-black print:text-black">
                      Materi
                    </th>

                    <th className="py-4 px-6 border-r border-[#EDF2F7] print:border print:border-black print:text-black">
                      Tugas
                    </th>

                    <th className="py-4 px-6 text-center w-36 print:hidden">
                      Aksi
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#EDF2F7] text-sm text-[#4A5568]">
                  {data.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-[#F8FAFC] transition-colors print:break-inside-avoid"
                    >
                      <td className="py-4 px-6 border-r border-[#EDF2F7] text-center font-semibold text-gray-700 print:border print:border-black print:text-black">
                        {item.pertemuan}
                      </td>

                      <td className="py-4 px-6 border-r border-[#EDF2F7] whitespace-nowrap print:border print:border-black print:text-black">
                        {new Date(item.tanggal).toLocaleDateString("id-ID")}
                      </td>

                      <td className="py-4 px-6 border-r border-[#EDF2F7] print:border print:border-black print:text-black">
                        {item.materi}
                      </td>

                      <td className="py-4 px-6 border-r border-[#EDF2F7] print:border print:border-black print:text-black">
                        {item.tugas || "-"}
                      </td>

                      <td className="py-4 px-6 text-center whitespace-nowrap print:hidden">
                        <div className="inline-flex items-center gap-2">
                          <Link
                            href={`/dashboard/rekap/edit?id=${
                              item.id
                            }&matkulId=${
                              selectedMatkulId || item.mataKuliahId
                            }&pertemuan=${
                              item.pertemuan
                            }&tanggal=${encodeURIComponent(
                              new Date(item.tanggal)
                                .toISOString()
                                .split("T")[0]
                            )}&materi=${encodeURIComponent(
                              item.materi
                            )}&tugas=${encodeURIComponent(item.tugas || "")}`}
                            className="bg-[#5B6DD6] hover:bg-[#4858B8] text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition inline-flex items-center gap-1 shadow-xs"
                          >
                            <Edit2 size={13} />
                            <span>Edit</span>
                          </Link>

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(item.id, item.pertemuan)
                            }
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
      </div>

      {/* Tombol Bagikan */}
      <div className="flex justify-end pt-2 print:hidden">
        <button
          type="button"
          onClick={handleShare}
          className="inline-flex items-center gap-2 border border-[#CCD7ED] bg-white hover:bg-gray-50 text-gray-700 px-6 py-2.5 rounded-lg text-sm font-semibold transition shadow-xs"
        >
          <Share2 size={16} />
          <span>Bagikan</span>
        </button>
      </div>

      {/* Modal Bagikan Rekap Materi */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 print:hidden">
          <div className="bg-white w-full max-w-md rounded-xl shadow-xl p-5 relative">
            {/* Header Modal */}
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-bold text-gray-800">
                Bagikan Rekap Materi
              </h2>

              <button
                type="button"
                onClick={() => setShowShareModal(false)}
                className="text-gray-400 hover:text-gray-700 text-xl font-bold"
              >
                ×
              </button>
            </div>

            <p className="text-xs text-gray-500 mb-5">
              Pilih opsi di bawah ini untuk mengunduh atau mencetak rekap
              materi.
            </p>

            {/* Download PDF */}
            <div className="border border-[#DCE4F0] rounded-lg p-3 flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="bg-[#EEF1FF] p-3 rounded-lg text-[#6379F5]">
                  <FileDown size={22} />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-gray-800">
                    Download PDF
                  </h3>

                  <p className="text-xs text-gray-500">
                    Unduh rekap materi dalam bentuk PDF.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleDownloadPDF}
                className="bg-[#52C463] hover:bg-[#43AD53] text-white px-4 py-2 rounded-lg text-xs font-semibold transition"
              >
                Download PDF
              </button>
            </div>

            {/* Print */}
            <div className="border border-[#DCE4F0] rounded-lg p-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-[#EEF1FF] p-3 rounded-lg text-[#6379F5]">
                  <Printer size={22} />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-gray-800">
                    Print
                  </h3>

                  <p className="text-xs text-gray-500">
                    Cetak rekap materi ajar secara langsung.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handlePrint}
                className="bg-[#52C463] hover:bg-[#43AD53] text-white px-5 py-2 rounded-lg text-xs font-semibold transition"
              >
                Print
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="text-center text-xs md:text-sm text-gray-500 pt-4 print:hidden">
        @2026 | Aplikasi Rekap Materi Mengajar Dosen.
      </footer>

      {/* Pengaturan khusus halaman cetak */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 15mm;
          }

          body * {
            visibility: hidden !important;
          }

          #rekap-print-area,
          #rekap-print-area * {
            visibility: visible !important;
          }

          #rekap-print-area {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
          }

          #rekap-print-area table {
            width: 100% !important;
            border-collapse: collapse !important;
          }

          #rekap-print-area th,
          #rekap-print-area td {
            border: 1px solid #333 !important;
            color: black !important;
            padding: 10px !important;
          }

          #rekap-print-area thead {
            display: table-header-group;
          }

          #rekap-print-area tr {
            break-inside: avoid;
          }

          #rekap-print-area .hidden.print\\:block {
            display: block !important;
          }
        }
      `}</style>
    </div>
  );
}

export default function DetailRekap() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-sm text-gray-500">
          Memuat halaman...
        </div>
      }
    >
      <DetailRekapContent />
    </Suspense>
  );
}
