"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function RekapMateriForm({ onSuccess, onCancel }: { onSuccess?: () => void; onCancel?: () => void }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [matkuls, setMatkuls] = useState<Array<{ id: string; nama: string }>>([]);
  const [userEmail, setUserEmail] = useState("");
  const [form, setForm] = useState({
    mataKuliahId: "",
    mataKuliah: "",
    tanggal: new Date().toISOString().split("T")[0],
    pertemuan: "1",
    materi: "",
    tugas: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      const u = stored ? JSON.parse(stored) : null;
      if (u) {
        setUserEmail(u.email || "");
        fetch(`/api/matakuliah?email=${encodeURIComponent(u.email || "")}&role=${u.role || "DOSEN"}`)
          .then((r) => r.json())
          .then((j) => {
            if (j.success && Array.isArray(j.data)) {
              setMatkuls(j.data);
              const qId = searchParams.get("matkulId");
              const qNama = searchParams.get("matkulNama");
              if (qId) {
                setForm((p) => ({ ...p, mataKuliahId: qId, mataKuliah: qNama || "" }));
              } else if (j.data.length > 0) {
                setForm((p) => ({ ...p, mataKuliahId: j.data[0].id, mataKuliah: j.data[0].nama }));
              }
            }
          });
      }
    } catch {
      // ignore
    }
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "mataKuliahId") {
      const sel = matkuls.find((m) => m.id === value);
      setForm((p) => ({ ...p, mataKuliahId: value, mataKuliah: sel?.nama || "" }));
    } else {
      setForm((p) => ({ ...p, [name]: value }));
    }
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/materi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, dosenEmail: userEmail }),
      });
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          if (onSuccess) onSuccess();
          else router.push("/dashboard/rekap");
        }, 1200);
      } else {
        const j = await res.json();
        setError(j.message || "Gagal menyimpan.");
      }
    } catch {
      setError("Kesalahan koneksi.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {success && (
        <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
          Materi ajar berhasil disimpan. Mengalihkan ke rekap...
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="mataKuliahId" className="block text-sm font-bold text-[#2D3748] mb-2">
          Mata Kuliah
        </label>
        {matkuls.length > 0 ? (
          <select
            id="mataKuliahId"
            name="mataKuliahId"
            required
            value={form.mataKuliahId}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-lg border border-[#CCD7ED] bg-white text-sm text-gray-800"
          >
            {matkuls.map((m) => (
              <option key={m.id} value={m.id}>
                {m.nama}
              </option>
            ))}
          </select>
        ) : (
          <input
            id="mataKuliah"
            type="text"
            name="mataKuliah"
            required
            value={form.mataKuliah}
            onChange={handleChange}
            placeholder="Mata Kuliah"
            className="w-full px-4 py-2.5 rounded-lg border border-[#CCD7ED] bg-white text-sm text-gray-800"
          />
        )}
      </div>

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
          className="w-full px-4 py-2.5 rounded-lg border border-[#CCD7ED] bg-white text-sm text-gray-800"
        />
      </div>

      <div>
        <label htmlFor="pertemuan" className="block text-sm font-bold text-[#2D3748] mb-2">
          Pertemuan
        </label>
        <input
          id="pertemuan"
          type="number"
          name="pertemuan"
          required
          min={1}
          value={form.pertemuan}
          onChange={handleChange}
          placeholder="1"
          className="w-full px-4 py-2.5 rounded-lg border border-[#CCD7ED] bg-white text-sm text-gray-800"
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
          className="w-full px-4 py-2.5 rounded-lg border border-[#CCD7ED] bg-white text-sm text-gray-800 resize-y"
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
          placeholder="Tugas"
          className="w-full px-4 py-2.5 rounded-lg border border-[#CCD7ED] bg-white text-sm text-gray-800"
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
          onClick={() => (onCancel ? onCancel() : router.push("/dashboard/rekap"))}
          className="px-8 py-2.5 border border-[#CCD7ED] text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-semibold transition"
        >
          Batal
        </button>
      </div>
    </form>
  );
}
