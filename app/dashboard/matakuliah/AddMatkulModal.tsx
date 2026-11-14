// "use client";

// import { useState } from "react";

// interface AddMatkulModalProps {
//   dosens: Array<{ email: string; nama: string }>;
//   onClose: () => void;
//   onSuccess: () => void;
// }

// export default function AddMatkulModal({ dosens, onClose, onSuccess }: AddMatkulModalProps) {
//   const [form, setForm] = useState({
//     nama: "",
//     kode: "",
//     sks: 3,
//     dosenEmail: dosens[0]?.email || "",
//   });
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!form.nama || !form.dosenEmail) return;

//     setLoading(true);
//     try {
//       const res = await fetch("/api/matakuliah", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(form),
//       });
//       if (res.ok) {
//         onSuccess();
//       } else {
//         const json = await res.json();
//         alert(json.message || "Gagal membuat mata kuliah.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
//       <div className="bg-white rounded-2xl border border-[#DCE4F0] p-6 max-w-md w-full shadow-lg space-y-4">
//         <h2 className="text-xl font-bold text-[#2D3748]">Tambah Mata Kuliah</h2>
//         <form onSubmit={handleSubmit} className="space-y-3 text-sm">
//           <div>
//             <label className="block font-bold text-gray-700 mb-1">Nama Mata Kuliah</label>
//             <input
//               required
//               value={form.nama}
//               onChange={(e) => setForm({ ...form, nama: e.target.value })}
//               placeholder="Contoh: Pemrograman Web"
//               className="w-full px-3 py-2 border rounded-lg"
//             />
//           </div>
//           <div className="grid grid-cols-2 gap-2">
//             <div>
//               <label className="block font-bold text-gray-700 mb-1">Kode</label>
//               <input
//                 value={form.kode}
//                 onChange={(e) => setForm({ ...form, kode: e.target.value })}
//                 placeholder="IF-101"
//                 className="w-full px-3 py-2 border rounded-lg"
//               />
//             </div>
//             <div>
//               <label className="block font-bold text-gray-700 mb-1">SKS</label>
//               <input
//                 type="number"
//                 min={1}
//                 max={6}
//                 value={form.sks}
//                 onChange={(e) => setForm({ ...form, sks: Number(e.target.value) })}
//                 className="w-full px-3 py-2 border rounded-lg"
//               />
//             </div>
//           </div>
//           <div>
//             <label className="block font-bold text-gray-700 mb-1">Assign Dosen Pengampu</label>
//             <select
//               required
//               value={form.dosenEmail}
//               onChange={(e) => setForm({ ...form, dosenEmail: e.target.value })}
//               className="w-full px-3 py-2 border rounded-lg bg-white"
//             >
//               {dosens.map((d) => (
//                 <option key={d.email} value={d.email}>
//                   {d.nama} ({d.email})
//                 </option>
//               ))}
//             </select>
//           </div>
//           <div className="flex justify-end gap-2 pt-3">
//             <button
//               type="button"
//               onClick={onClose}
//               className="px-4 py-2 border rounded-lg font-semibold text-gray-700"
//             >
//               Batal
//             </button>
//             <button
//               type="submit"
//               disabled={loading}
//               className="px-5 py-2 bg-[#52C463] text-white rounded-lg font-semibold shadow-xs disabled:opacity-50"
//             >
//               {loading ? "Menyimpan..." : "Simpan & Assign"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }


// dari no 1-114 codingan lama sebelum di revisi


"use client";

import { useState } from "react";

interface AddMatkulModalProps {
  dosens: Array<{ email: string; nama: string }>;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddMatkulModal({
  dosens,
  onClose,
  onSuccess,
}: AddMatkulModalProps) {
  const [form, setForm] = useState({
    tahunAjaran: "",
    semester: "Ganjil",
    nama: "",
    kode: "",
    sks: 3,
    dosenEmail: dosens[0]?.email || "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: name === "sks" ? Number(value) : value,
    }));

    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !form.tahunAjaran ||
      !form.semester ||
      !form.nama.trim() ||
      !form.dosenEmail
    ) {
      setError("Semua data wajib diisi.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/matakuliah", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          nama: form.nama.trim(),
          kode: form.kode.trim(),
          sks: Number(form.sks),
        }),
      });

      const json = await res.json();

      if (res.ok && json.success) {
        onSuccess();
      } else {
        setError(json.message || "Gagal membuat mata kuliah.");
      }
    } catch {
      setError("Terjadi kesalahan koneksi.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full h-9 px-3 border border-[#D5DDF2] rounded-lg bg-[#F9FAFF] text-sm text-[#344054] placeholder:text-gray-400 focus:outline-none focus:border-[#6578DB] focus:ring-2 focus:ring-[#6578DB]/20 transition";

  const labelClass =
    "block text-sm font-semibold text-[#2D3748] mb-1.5";

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl border border-[#DCE4F0] p-6 w-full max-w-95 shadow-xl">

        <h2 className="text-lg font-bold text-[#2D3748] mb-5">
          Tambah Mata Kuliah
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3 text-sm">

          {error && (
            <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs">
              {error}
            </div>
          )}

          {/* Tahun Ajaran dan Semester */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="tahunAjaran" className={labelClass}>
                Tahun Ajaran
              </label>
              <input
                id="tahunAjaran"
                type="text"
                name="tahunAjaran"
                value={form.tahunAjaran}
                onChange={handleChange}
                placeholder="Contoh: 2026/2027"
                required
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="semester" className={labelClass}>
                Semester
              </label>
              <select
                id="semester"
                name="semester"
                value={form.semester}
                onChange={handleChange}
                required
                className={inputClass}
              >
                <option value="Ganjil">Ganjil</option>
                <option value="Genap">Genap</option>
              </select>
            </div>
          </div>

          {/* Nama Mata Kuliah */}
          <div>
            <label htmlFor="nama" className={labelClass}>
              Mata Kuliah
            </label>
            <input
              id="nama"
              type="text"
              name="nama"
              value={form.nama}
              onChange={handleChange}
              placeholder="Contoh: Basic OS"
              required
              className={inputClass}
            />
          </div>

          {/* Kode dan SKS */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="kode" className={labelClass}>
                Kode
              </label>
              <input
                id="kode"
                type="text"
                name="kode"
                value={form.kode}
                onChange={handleChange}
                placeholder="BOS-203"
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="sks" className={labelClass}>
                SKS
              </label>
              <input
                id="sks"
                type="number"
                name="sks"
                min={1}
                max={6}
                value={form.sks}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>
          </div>

          {/* Assign Dosen */}
          <div>
            <label htmlFor="dosenEmail" className={labelClass}>
              Assign Dosen Pengampu
            </label>

            <select
              id="dosenEmail"
              name="dosenEmail"
              value={form.dosenEmail}
              onChange={handleChange}
              required
              className={inputClass}
            >
              <option value="">Pilih Dosen Pengampu</option>

              {dosens.map((d) => (
                <option key={d.email} value={d.email}>
                  {d.nama} ({d.email})
                </option>
              ))}
            </select>
          </div>

          {/* Tombol */}
          <div className="flex justify-end gap-2 pt-2">

            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-5 py-2 border border-[#CCD7ED] text-gray-700 hover:bg-gray-50 rounded-lg font-semibold transition disabled:opacity-50"
            >
              Batal
            </button>

            <button
              type="submit"
              disabled={loading || dosens.length === 0}
              className="px-4 py-2 bg-[#52C463] hover:bg-[#43AD53] text-white rounded-lg font-semibold shadow-sm transition disabled:opacity-50"
            >
              {loading ? "Menyimpan..." : "Simpan & Assign"}
            </button>

          </div>
        </form>
      </div>
    </div>
  );
}
