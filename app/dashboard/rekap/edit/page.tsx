"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

function EditMateriContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [form, setForm] = useState({
    tanggal: "",
    pertemuan: "5",
    materi: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const qTanggal = searchParams.get("tanggal");
    const qPertemuan = searchParams.get("pertemuan");
    const qMateri = searchParams.get("materi");

    setForm({
      tanggal: qTanggal || "",
      pertemuan: qPertemuan || "5",
      materi: qMateri || "",
    });
  }, [searchParams]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/materi", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/dashboard/rekap/id");
        }, 1200);
      } else {
        setError("Gagal memperbarui materi ajar.");
      }
    } catch {
      setError("Terjadi kesalahan koneksi.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {success && (
        <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
          Materi ajar berhasil diperbarui. Mengalihkan...
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="tanggal" className="block text-sm font-bold text-[#2D3748] mb-2">
          Tanggal
        </label>
        <input
          id="tanggal"
          type="text"
          name="tanggal"
          required
          value={form.tanggal}
          onChange={handleChange}
          placeholder="MikroTik"
          className="w-full px-4 py-2.5 rounded-lg border border-[#CCD7ED] bg-white text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5469D4]/30 focus:border-[#5469D4] transition"
        />
      </div>

      <div>
        <label htmlFor="pertemuan" className="block text-sm font-bold text-[#2D3748] mb-2">
          Pertemuan
        </label>
        <input
          id="pertemuan"
          type="text"
          name="pertemuan"
          required
          value={form.pertemuan}
          onChange={handleChange}
          placeholder="5"
          className="w-full px-4 py-2.5 rounded-lg border border-[#CCD7ED] bg-white text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5469D4]/30 focus:border-[#5469D4] transition"
        />
      </div>

      <div>
        <label htmlFor="materi" className="block text-sm font-bold text-[#2D3748] mb-2">
          Materi
        </label>
        <textarea
          id="materi"
          name="materi"
          required
          rows={3}
          value={form.materi}
          onChange={handleChange}
          placeholder="Materi ...."
          className="w-full px-4 py-2.5 rounded-lg border border-[#CCD7ED] bg-white text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5469D4]/30 focus:border-[#5469D4] transition resize-y"
        />
      </div>

      <div className="flex justify-end items-center gap-3 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="px-8 py-2.5 bg-[#52C463] hover:bg-[#43ad53] text-white rounded-lg text-sm font-semibold transition shadow-xs disabled:opacity-50"
        >
          {loading ? "Menyimpan..." : "Simpan"}
        </button>
        <button
          type="button"
          onClick={handleCancel}
          className="px-8 py-2.5 border border-[#CCD7ED] text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-semibold transition"
        >
          Batal
        </button>
      </div>
    </form>
  );
}

export default function EditMateriPage() {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard/rekap/id"
          className="p-2 bg-white border border-[#DCE4F0] rounded-lg hover:bg-gray-50 text-gray-600 transition shadow-xs"
          aria-label="Kembali"
        >
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl md:text-3xl font-bold text-[#2D3748]">
          Edit Materi Ajar
        </h1>
      </div>

      {/* Cardbox Container */}
      <div className="bg-white border border-[#DCE4F0] rounded-2xl p-6 md:p-10 shadow-xs">
        <Suspense fallback={<div className="text-sm text-gray-500">Memuat data...</div>}>
          <EditMateriContent />
        </Suspense>
      </div>

      {/* Footer */}
      <footer className="text-center text-xs md:text-sm text-gray-500 pt-4">
        @2026 | Aplikasi Rekap Materi Mengajar Dosen.
      </footer>
    </div>
  );
}
