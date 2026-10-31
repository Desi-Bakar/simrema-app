"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";

function EditMateriContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [form, setForm] = useState({
    id: "",
    mataKuliahId: "",
    tanggal: "",
    pertemuan: "1",
    materi: "",
    tugas: "",
  });

  const [matkuls, setMatkuls] = useState<Array<{ id: string; nama: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      const user = stored ? JSON.parse(stored) : null;
      fetch(`/api/matakuliah?email=${encodeURIComponent(user?.email || "")}&role=${user?.role || "DOSEN"}`)
        .then((r) => r.json())
        .then((j) => {
          if (j.success && Array.isArray(j.data)) setMatkuls(j.data);
        });
    } catch {}

    const qId = searchParams.get("id") || "";
    const qMatkulId = searchParams.get("matkulId") || searchParams.get("mataKuliahId") || "";
    const qTanggal = searchParams.get("tanggal") || "";
    const qPertemuan = searchParams.get("pertemuan") || "1";
    const qMateri = searchParams.get("materi") || "";
    const qTugas = searchParams.get("tugas") || "";

    setForm({
      id: qId,
      mataKuliahId: qMatkulId,
      tanggal: qTanggal,
      pertemuan: qPertemuan,
      materi: qMateri,
      tugas: qTugas,
    });
  }, [searchParams]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
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
        body: JSON.stringify({
          id: form.id || undefined,
          mataKuliahId: form.mataKuliahId || undefined,
          pertemuan: Number(form.pertemuan),
          tanggal: form.tanggal ? new Date(form.tanggal).toISOString() : undefined,
          materi: form.materi,
          tugas: form.tugas,
        }),
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          if (form.mataKuliahId) {
            router.push(`/dashboard/rekap/id?matkulId=${form.mataKuliahId}`);
          } else {
            router.push("/dashboard/rekap");
          }
        }, 1000);
      } else {
        const j = await res.json().catch(() => ({}));
        setError(j.message || "Gagal memperbarui materi ajar.");
      }
    } catch {
      setError("Terjadi kesalahan koneksi.");
    } finally {
      setLoading(false);
    }
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

      {matkuls.length > 0 && (
        <div>
          <label htmlFor="mataKuliahId" className="block text-sm font-bold text-[#2D3748] mb-2">
            Mata Kuliah
          </label>
          <select
            id="mataKuliahId"
            name="mataKuliahId"
            value={form.mataKuliahId}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-lg border border-[#CCD7ED] bg-white text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#5469D4]/30"
          >
            <option value="">Pilih Mata Kuliah</option>
            {matkuls.map((m) => (
              <option key={m.id} value={m.id}>
                {m.nama}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label htmlFor="tanggal" className="block text-sm font-bold text-[#2D3748] mb-2">
          Tanggal
        </label>
        <input
          id="tanggal"
          type="date"
          name="tanggal"
          required
          value={form.tanggal}
          onChange={handleChange}
          className="w-full px-4 py-2.5 rounded-lg border border-[#CCD7ED] bg-white text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#5469D4]/30 focus:border-[#5469D4] transition"
        />
      </div>

      <div>
        <label htmlFor="pertemuan" className="block text-sm font-bold text-[#2D3748] mb-2">
          Pertemuan
        </label>
        <input
          id="pertemuan"
          type="number"
          min={1}
          name="pertemuan"
          required
          value={form.pertemuan}
          onChange={handleChange}
          placeholder="1"
          className="w-full px-4 py-2.5 rounded-lg border border-[#CCD7ED] bg-white text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#5469D4]/30 focus:border-[#5469D4] transition"
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
          placeholder="Tuliskan materi pembelajaran..."
          className="w-full px-4 py-2.5 rounded-lg border border-[#CCD7ED] bg-white text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#5469D4]/30 focus:border-[#5469D4] transition resize-y"
        />
      </div>

      <div>
        <label htmlFor="tugas" className="block text-sm font-bold text-[#2D3748] mb-2">
          Tugas
        </label>
        <input
          id="tugas"
          type="text"
          name="tugas"
          value={form.tugas}
          onChange={handleChange}
          placeholder="Penugasan (opsional)"
          className="w-full px-4 py-2.5 rounded-lg border border-[#CCD7ED] bg-white text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#5469D4]/30 focus:border-[#5469D4] transition"
        />
      </div>

      <div className="flex justify-end items-center gap-3 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="px-8 py-2.5 bg-[#52C463] hover:bg-[#43ad53] text-white rounded-lg text-sm font-semibold transition shadow-xs disabled:opacity-50"
        >
          {loading ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-8 py-2.5 border border-[#CCD7ED] text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-semibold transition"
        >
          Batal
        </button>
      </div>
    </form>
  );
}

export default function EditMateriPage() {
  const router = useRouter();

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="p-2 bg-white border border-[#DCE4F0] rounded-lg hover:bg-gray-50 text-gray-600 transition shadow-xs"
          aria-label="Kembali"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl md:text-3xl font-bold text-[#2D3748]">
          Edit Materi Ajar
        </h1>
      </div>

      <div className="bg-white border border-[#DCE4F0] rounded-2xl p-6 md:p-10 shadow-xs">
        <Suspense fallback={<div className="text-sm text-gray-500">Memuat data...</div>}>
          <EditMateriContent />
        </Suspense>
      </div>

      <footer className="text-center text-xs md:text-sm text-gray-500 pt-4">
        @2026 | Aplikasi Rekap Materi Mengajar Dosen.
      </footer>
    </div>
  );
}
