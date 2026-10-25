"use client";

import { useState } from "react";

interface AddMatkulModalProps {
  dosens: Array<{ email: string; nama: string }>;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddMatkulModal({ dosens, onClose, onSuccess }: AddMatkulModalProps) {
  const [form, setForm] = useState({
    nama: "",
    kode: "",
    sks: 3,
    dosenEmail: dosens[0]?.email || "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nama || !form.dosenEmail) return;

    setLoading(true);
    try {
      const res = await fetch("/api/matakuliah", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        onSuccess();
      } else {
        const json = await res.json();
        alert(json.message || "Gagal membuat mata kuliah.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-[#DCE4F0] p-6 max-w-md w-full shadow-lg space-y-4">
        <h2 className="text-xl font-bold text-[#2D3748]">Tambah Mata Kuliah</h2>
        <form onSubmit={handleSubmit} className="space-y-3 text-sm">
          <div>
            <label className="block font-bold text-gray-700 mb-1">Nama Mata Kuliah</label>
            <input
              required
              value={form.nama}
              onChange={(e) => setForm({ ...form, nama: e.target.value })}
              placeholder="Contoh: Pemrograman Web"
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Kode</label>
              <input
                value={form.kode}
                onChange={(e) => setForm({ ...form, kode: e.target.value })}
                placeholder="IF-101"
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1">SKS</label>
              <input
                type="number"
                min={1}
                max={6}
                value={form.sks}
                onChange={(e) => setForm({ ...form, sks: Number(e.target.value) })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
          </div>
          <div>
            <label className="block font-bold text-gray-700 mb-1">Assign Dosen Pengampu</label>
            <select
              required
              value={form.dosenEmail}
              onChange={(e) => setForm({ ...form, dosenEmail: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg bg-white"
            >
              {dosens.map((d) => (
                <option key={d.email} value={d.email}>
                  {d.nama} ({d.email})
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg font-semibold text-gray-700"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-[#52C463] text-white rounded-lg font-semibold shadow-xs disabled:opacity-50"
            >
              {loading ? "Menyimpan..." : "Simpan & Assign"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
