"use client";

import { useState } from "react";

export default function RekapMateriPage() {
  const tahunMasehi = new Date().getFullYear()

  const rekapMateriForm  = [
    {
      "id": "mataKuliah",
      "name": "Mata Kuliah",
      "type": "text",
      "placeholder": "Masukkan mata kuliah yang ingin direkap"
    },
    {
      "id": "tanggalRekap",
      "name": "Tanggal Rekap Mata Kuliah",
      "type": "date",
      "placeholder": "Masukkan tanggal rekap"
    },
    {
      "id": "pertemuanDosen",
      "name": "Pertemuan Perkuliahan",
      "type": "number",
      "placeholder": "Masukkan angka pertemuan perkuliahan"
    },{
      "id": "materiPerkuliahan",
      "name": "Materi Perkuliahan",
      "type": "text",
      "placeholder": "Masukkan materi perkuliahan"
    }
  ]

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
    <div className="flex-1 p-6 bg-gray-100">

      {/* Title */}
      <h1 className="text-2xl font-semibold mb-6 text-center">
        Tambah Materi Ajar
      </h1>

      {/* Card Form (SUDAH DI CENTER) */}
      <div className="bg-white p-6 rounded-xl shadow-sm max-w-2xl mx-auto mt-6">

        <form onSubmit={handleSubmit} className="space-y-4">

        {
          rekapMateriForm.map((input) => (
            <div key={input.id}>
              <label className="block text-sm font-medium mb-1">
                {input.name}
              </label>
              <input
                type={input.type}
                name={input.id}
                value={form.mataKuliah}
                onChange={handleChange}
                placeholder={input.placeholder}
                className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
          ))
        }
          {/* Mata Kuliah */}
          

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

    </div>
  );
}