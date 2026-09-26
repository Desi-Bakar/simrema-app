"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface FormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function RekapMateriForm({ onSuccess, onCancel }: FormProps) {
  const router = useRouter();

  const [form, setForm] = useState({
    mataKuliah: "",
    tanggal: "",
    pertemuan: "",
    materi: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const rekapMateriForm = [
    {
      id: "mataKuliah",
      name: "Mata Kuliah",
      type: "text",
      placeholder: "Contoh: Jaringan Komputer, Algoritma",
    },
    {
      id: "tanggal",
      name: "Tanggal Perkuliahan",
      type: "date",
      placeholder: "Pilih tanggal perkuliahan",
    },
    {
      id: "pertemuan",
      name: "Pertemuan Ke-",
      type: "number",
      placeholder: "Contoh: 1, 2, 3...",
    },
    {
      id: "materi",
      name: "Materi Perkuliahan",
      type: "text",
      placeholder: "Contoh: Pengenalan OSI Model & TCP/IP",
    },
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/materi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          if (onSuccess) {
            onSuccess();
          } else {
            router.push("/dashboard/rekap");
          }
        }, 1200);
      } else {
        alert("Gagal menyimpan materi.");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan koneksi.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      router.push("/dashboard/rekap");
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm max-w-2xl mx-auto border border-gray-100">
      <h2 className="text-xl font-bold mb-6 text-gray-800">Tambah Materi Ajar</h2>

      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
          ✓ Materi berhasil disimpan! Mengalihkan...
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {rekapMateriForm.map((input) => (
          <div key={input.id}>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              {input.name}
            </label>
            <input
              type={input.type}
              name={input.id}
              required
              value={form[input.id as keyof typeof form]}
              onChange={handleChange}
              placeholder={input.placeholder}
              className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
        ))}

        <div className="flex justify-end gap-3 pt-4 border-t">
          <button
            type="button"
            onClick={handleCancel}
            className="px-5 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 text-sm font-medium transition"
          >
            Batal
          </button>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 text-sm font-medium shadow-sm transition disabled:opacity-50"
          >
            {loading ? "Menyimpan..." : "Simpan Materi"}
          </button>
        </div>
      </form>
    </div>
  );
}