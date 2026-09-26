"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Mail, Phone, GraduationCap, MapPin, ShieldCheck, Key } from "lucide-react";

export default function ProfilPage() {
  const [profile, setProfile] = useState({
    nama: "Administrator SIMREMA",
    email: "admin@simrema.ac.id",
    telepon: "081234567890",
    prodi: "Biro Administrasi Akademik",
    alamat: "Kampus Utama SIMREMA, Gedung Rektorat Lt. 1",
    role: "ADMIN",
    foto: "/profil.png",
  });

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        const parsed = JSON.parse(stored);
        setProfile((prev) => ({
          ...prev,
          nama: parsed.nama || prev.nama,
          email: parsed.email || prev.email,
          telepon: parsed.telepon || prev.telepon,
          role: parsed.role || prev.role,
          foto: parsed.foto || prev.foto,
        }));

        // Fetch fresh from API
        fetch(`/api/profil?email=${encodeURIComponent(parsed.email)}`)
          .then((res) => res.json())
          .then((json) => {
            if (json.success && json.data) {
              setProfile((prev) => ({
                ...prev,
                ...json.data,
              }));
            }
          })
          .catch(console.error);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword) return;
    setPasswordSuccess(true);
    setTimeout(() => {
      setShowPasswordModal(false);
      setPasswordSuccess(false);
      setNewPassword("");
    }, 1200);
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Profil Pengguna</h1>
        <p className="text-gray-500 text-sm mt-1">
          Informasi identitas akun dan data profil Anda di sistem SIMREMA.
        </p>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-2xl border border-indigo-100 shadow-sm overflow-hidden">
        {/* Banner Top */}
        <div className="h-32 bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 relative">
          <div className="absolute -bottom-16 left-8">
            <div className="w-32 h-32 rounded-full border-4 border-white bg-white overflow-hidden shadow-md">
              <Image
                src={profile.foto || "/profil.png"}
                alt="Foto Profil"
                width={128}
                height={128}
                className="object-cover w-full h-full"
              />
            </div>
          </div>
        </div>

        {/* User Info Header */}
        <div className="pt-20 px-8 pb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  {profile.nama}
                </h2>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 uppercase tracking-wide">
                  <ShieldCheck size={14} /> {profile.role}
                </span>
              </div>
              <p className="text-gray-500 text-sm mt-1 flex items-center gap-2">
                <Mail size={16} className="text-gray-400" /> {profile.email}
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Link href="/dashboard/profil/edit">
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-medium text-sm transition shadow-sm">
                  Edit Profil
                </button>
              </Link>
              <button
                onClick={() => setShowPasswordModal(true)}
                className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-5 py-2.5 rounded-lg font-medium text-sm transition shadow-sm flex items-center gap-2"
              >
                <Key size={16} />
                Ganti Password
              </button>
            </div>
          </div>

          {/* Detailed Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="flex items-start gap-3 p-4 rounded-xl bg-gray-50/80 border border-gray-100">
              <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-lg">
                <GraduationCap size={20} />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Program Studi / Unit
                </p>
                <p className="text-sm font-medium text-gray-800 mt-0.5">
                  {profile.prodi || "Belum diatur"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-xl bg-gray-50/80 border border-gray-100">
              <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-lg">
                <Phone size={20} />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Nomor Telepon
                </p>
                <p className="text-sm font-medium text-gray-800 mt-0.5">
                  {profile.telepon || "Belum diatur"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-xl bg-gray-50/80 border border-gray-100 md:col-span-2">
              <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-lg">
                <MapPin size={20} />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Alamat / Ruangan Kerja
                </p>
                <p className="text-sm font-medium text-gray-800 mt-0.5">
                  {profile.alamat || "Belum diatur"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Ganti Password */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-lg">
            <h3 className="text-lg font-bold mb-4 text-gray-800">Ganti Password</h3>

            {passwordSuccess ? (
              <div className="p-4 bg-green-50 text-green-700 rounded-lg text-sm mb-4">
                ✓ Password berhasil diperbarui!
              </div>
            ) : (
              <form onSubmit={handleUpdatePassword} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    Password Baru
                  </label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Masukkan password baru"
                    className="w-full border rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowPasswordModal(false)}
                    className="px-4 py-2 border rounded-lg text-sm text-gray-600 hover:bg-gray-50"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700"
                  >
                    Simpan Password
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}