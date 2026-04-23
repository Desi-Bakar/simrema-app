"use client";

import { useState } from "react";

export default function RekapMateriPage() {
  const [form, setForm] = useState({
    mataKuliah: "",
    tanggal: "",
    pertemuan: "",
    materi: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(form);
    alert("Data berhasil disimpan!");
  };

  return (
    <div className="flex-1 p-6 bg-gray-100 min-h-screen">

      {/* Title */}
      <h1 className="text-2xl font-semibold mb-6 text-center">
        Tambah Materi Ajar
      </h1>

      {/* Card Form (SUDAH DI CENTER) */}
      <div className="bg-white p-6 rounded-xl shadow-sm max-w-2xl mx-auto mt-6">

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Mata Kuliah */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Mata Kuliah
            </label>
            <input
              type="text"
              name="mataKuliah"
              value={form.mataKuliah}
              onChange={handleChange}
              placeholder="Mata Kuliah"
              className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          {/* Tanggal */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Tanggal
            </label>
            <input
              type="date"
              name="tanggal"
              value={form.tanggal}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          {/* Pertemuan */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Pertemuan
            </label>
            <input
              type="number"
              name="pertemuan"
              value={form.pertemuan}
              onChange={handleChange}
              placeholder="Pertemuan"
              className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          {/* Materi */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Materi
            </label>
            <textarea
              name="materi"
              value={form.materi}
              onChange={handleChange}
              placeholder="Materi..."
              rows={4}
              className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-100"
            >
              Batal
            </button>

            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600"
            >
              Simpan
            </button>
          </div>

        </form>

      </div>

      {/* Footer */}
      <p className="text-center text-xs text-gray-400 mt-6">
        ©2025 | Aplikasi Rekap Materi Mengajar Dosen.
      </p>

    </div>
  );
}