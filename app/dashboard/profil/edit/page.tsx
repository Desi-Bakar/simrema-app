"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { HiOutlinePhotograph } from "react-icons/hi";

export default function EditProfil() {
  const router = useRouter();

  const [form, setForm] = useState({
    nama: "",
    email: "",
    telepon: "",
    prodi: "",
    alamat: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        const parsed = JSON.parse(stored);
        setForm((prev) => ({
          ...prev,
          nama: parsed.nama || "",
          email: parsed.email || "",
          telepon: parsed.telepon || "",
          prodi: parsed.prodi || "",
          alamat: parsed.alamat || "",
        }));

        fetch(`/api/profil?email=${encodeURIComponent(parsed.email)}`)
          .then((res) => res.json())
          .then((json) => {
            if (json.success && json.data) {
              setForm({
                nama: json.data.nama || "",
                email: json.data.email || "",
                telepon: json.data.telepon || "",
                prodi: json.data.prodi || "",
                alamat: json.data.alamat || "",
              });
            }
          })
          .catch(console.error);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

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
    setError(null);

    try {
      const res = await fetch("/api/profil", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.message || "Gagal menyimpan perubahan.");
      }

      // Update localStorage session
      const stored = localStorage.getItem("user");
      if (stored) {
        const parsed = JSON.parse(stored);
        localStorage.setItem(
          "user",
          JSON.stringify({
            ...parsed,
            nama: form.nama,
            telepon: form.telepon,
            prodi: form.prodi,
            alamat: form.alamat,
          })
        );
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/dashboard/profil");
      }, 1000);
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      {/* Judul */}
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Edit Profil</h1>

      {/* Card */}
      <div className="bg-white border border-indigo-200 rounded-xl shadow-sm p-6 md:p-10">
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
            ✓ Profil berhasil disimpan! Mengalihkan kembali...
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Foto */}
            <div className="flex flex-col items-center">
              <div className="w-36 h-36 rounded-full overflow-hidden border-2 border-indigo-200">
                <Image
                  src="/profil.png"
                  alt="Profil"
                  width={144}
                  height={144}
                  className="object-cover w-full h-full"
                />
              </div>

              <button
                type="button"
                className="mt-4 flex items-center gap-2 border border-indigo-200 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
              >
                <HiOutlinePhotograph size={20} />
                Ganti Foto
              </button>
            </div>

            {/* Input Fields */}
            <div className="md:col-span-2 space-y-5">
              <div>
                <label className="block mb-1.5 font-medium text-sm text-gray-700">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  name="nama"
                  required
                  value={form.nama}
                  onChange={handleChange}
                  placeholder="Contoh: Dr. Budi Santoso, M.Kom."
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
                />
              </div>

              <div>
                <label className="block mb-1.5 font-medium text-sm text-gray-700">
                  Email (Tidak dapat diubah)
                </label>
                <input
                  type="email"
                  name="email"
                  disabled
                  value={form.email}
                  className="w-full border border-gray-200 bg-gray-50 text-gray-500 rounded-lg px-4 py-2.5 text-sm cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block mb-1.5 font-medium text-sm text-gray-700">
                  Program Studi / Unit Kerja
                </label>
                <input
                  type="text"
                  name="prodi"
                  value={form.prodi}
                  onChange={handleChange}
                  placeholder="Contoh: Teknik Informatika / Biro Akademik"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
                />
              </div>

              <div>
                <label className="block mb-1.5 font-medium text-sm text-gray-700">
                  Nomor Telepon
                </label>
                <input
                  type="text"
                  name="telepon"
                  value={form.telepon}
                  onChange={handleChange}
                  placeholder="+62 812-..."
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
                />
              </div>

              <div>
                <label className="block mb-1.5 font-medium text-sm text-gray-700">
                  Alamat / Ruangan Kerja
                </label>
                <textarea
                  name="alamat"
                  rows={2}
                  value={form.alamat}
                  onChange={handleChange}
                  placeholder="Contoh: Kampus Utama Gedung Rektorat Lt. 1"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-6 border-t">
                <Link
                  href="/dashboard/profil"
                  className="border border-gray-300 px-6 py-2.5 rounded-lg font-medium text-sm text-gray-700 hover:bg-gray-100 transition inline-flex items-center"
                >
                  Batal
                </Link>

                <button
                  type="submit"
                  disabled={loading}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-2.5 rounded-lg font-medium text-sm transition shadow-sm disabled:opacity-50"
                >
                  {loading ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}