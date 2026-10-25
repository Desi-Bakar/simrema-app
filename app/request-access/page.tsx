"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Check } from "lucide-react";
import Navbar from "../components/navbar";

export default function RequestAccessPage() {
  const tahunMasehi = new Date().getFullYear();

  const [formData, setFormData] = useState({
    namaLengkap: "",
    nomorTelepon: "",
    alamatEmail: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/request-access", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Gagal mengajukan permintaan akses.");
      }

      setSuccess(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Terjadi kesalahan koneksi.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Content */}
      <div className="flex flex-1 items-center justify-center p-4">
        <div className="bg-white shadow-md rounded-xl w-full max-w-4xl p-8 flex flex-col md:flex-row gap-10">
          {/* Form */}
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-2">Request Access</h2>
            <p className="text-sm text-gray-500 mb-6">
              Daftarkan diri Anda sebagai dosen. Setelah request diverifikasi dan disetujui (ACC) oleh Admin, Anda akan menerima akses login.
            </p>

            {success ? (
              <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg p-6 text-center space-y-4">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                  <Check size={24} />
                </div>
                <h3 className="text-lg font-semibold">Request Berhasil Diajukan</h3>
                <p className="text-sm text-gray-600">
                  Data Anda atas nama <strong>{formData.namaLengkap}</strong> dengan email <strong>{formData.alamatEmail}</strong> dan nomor <strong>{formData.nomorTelepon}</strong> telah tersimpan dengan status <strong>Menunggu Persetujuan Admin</strong>.
                </p>
                <div className="pt-2">
                  <Link
                    href="/login"
                    className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
                  >
                    Kembali ke Halaman Login
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3">
                    {error}
                  </div>
                )}

                <div>
                  <label htmlFor="namaLengkap" className="block text-sm mb-1 text-zinc-600 font-medium">
                    Nama Lengkap
                  </label>
                  <input
                    id="namaLengkap"
                    name="namaLengkap"
                    type="text"
                    required
                    value={formData.namaLengkap}
                    onChange={handleChange}
                    placeholder="Masukan nama lengkap dosen"
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>

                <div>
                  <label htmlFor="nomorTelepon" className="block text-sm mb-1 text-zinc-600 font-medium">
                    Nomor Telepon / WhatsApp
                  </label>
                  <input
                    id="nomorTelepon"
                    name="nomorTelepon"
                    type="tel"
                    required
                    value={formData.nomorTelepon}
                    onChange={handleChange}
                    placeholder="Contoh: 081234567890"
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>

                <div>
                  <label htmlFor="alamatEmail" className="block text-sm mb-1 text-zinc-600 font-medium">
                    Email
                  </label>
                  <input
                    id="alamatEmail"
                    name="alamatEmail"
                    type="email"
                    required
                    value={formData.alamatEmail}
                    onChange={handleChange}
                    placeholder="Masukan alamat email dosen"
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-500 text-white py-2.5 rounded-lg hover:bg-blue-600 transition font-medium text-sm disabled:opacity-50"
                >
                  {loading ? "Mengirim Permintaan..." : "Kirim Request Access"}
                </button>
              </form>
            )}

            {!success && (
              <p className="text-sm text-gray-500 mt-5">
                Sudah punya akun?{" "}
                <Link href="/login" className="text-blue-500 font-medium hover:underline">
                  Login di sini
                </Link>
              </p>
            )}
          </div>

          {/* Illustration */}
          <div className="hidden md:flex flex-1 items-center justify-center">
            <Image
              src="/request.png"
              alt="Illustration"
              width={450}
              height={450}
              className="object-contain"
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center text-sm text-gray-500 py-4">
        ©{tahunMasehi} | Aplikasi Rekap Materi Mengajar Dosen.
      </footer>
    </main>
  );
}