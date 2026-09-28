"use client";

import { useEffect, useState, useRef } from "react";
import { Image as ImageIcon, KeyRound } from "lucide-react";

export default function ProfilPage() {
  const [activeTab, setActiveTab] = useState<"profil" | "password">("profil");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State Profil
  const [profile, setProfile] = useState({
    nama: "",
    email: "",
    telepon: "",
    foto: "/profil.png",
  });
  const [initialProfile, setInitialProfile] = useState(profile);

  // State Password
  const [password, setPassword] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Load profil saat inisialisasi
  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        const user = JSON.parse(stored);
        const data = {
          nama: user.nama || "",
          email: user.email || "",
          telepon: user.telepon || "",
          foto: user.foto || "/profil.png",
        };
        setProfile(data);
        setInitialProfile(data);

        // Ambil data terbaru dari server
        fetch(`/api/profil?email=${encodeURIComponent(user.email)}`)
          .then((res) => res.json())
          .then((json) => {
            if (json.success && json.data) {
              const fresh = {
                nama: json.data.nama || "",
                email: json.data.email || "",
                telepon: json.data.telepon || "",
                foto: json.data.foto || "/profil.png",
              };
              setProfile(fresh);
              setInitialProfile(fresh);
            }
          })
          .catch(console.error);
      }
    } catch (e) {
      console.error("Gagal memuat profil:", e);
    }
  }, []);

  // Upload & preview foto
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfile((prev) => ({ ...prev, foto: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  // Simpan data profil
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setToast(null);

    try {
      const res = await fetch("/api/profil", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Gagal memperbarui profil.");

      // Sync ke localStorage session
      const stored = localStorage.getItem("user");
      if (stored) {
        const parsed = JSON.parse(stored);
        localStorage.setItem(
          "user",
          JSON.stringify({
            ...parsed,
            nama: profile.nama,
            telepon: profile.telepon,
            foto: profile.foto,
          })
        );
      }

      setInitialProfile(profile);
      setToast({ type: "success", text: "Profil berhasil disimpan." });
    } catch (err: any) {
      setToast({ type: "error", text: err.message || "Terjadi kesalahan." });
    } finally {
      setLoading(false);
    }
  };

  // Simpan password baru
  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setToast(null);

    if (password.newPassword.length < 6) {
      setToast({ type: "error", text: "Password baru minimal 6 karakter." });
      return;
    }

    if (password.newPassword !== password.confirmPassword) {
      setToast({ type: "error", text: "Konfirmasi password baru tidak cocok." });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/profil", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: profile.email,
          oldPassword: password.oldPassword,
          newPassword: password.newPassword,
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Gagal mengubah password.");

      setPassword({ oldPassword: "", newPassword: "", confirmPassword: "" });
      setToast({ type: "success", text: "Password berhasil diperbarui." });
    } catch (err: any) {
      setToast({ type: "error", text: err.message || "Terjadi kesalahan." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[740px] py-2">
      {/* Header Tabs */}
      <div className="flex items-center gap-8 border-b border-gray-200 mb-6">
        <button
          type="button"
          onClick={() => {
            setActiveTab("profil");
            setToast(null);
          }}
          className={`pb-3 text-lg font-bold transition-all relative ${
            activeTab === "profil"
              ? "text-gray-900 border-b-2 border-[#5469D4]"
              : "text-gray-400 hover:text-gray-600"
          }`}
        >
          Edit Profil
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab("password");
            setToast(null);
          }}
          className={`pb-3 text-lg font-bold transition-all relative ${
            activeTab === "password"
              ? "text-gray-900 border-b-2 border-[#5469D4]"
              : "text-gray-400 hover:text-gray-600"
          }`}
        >
          Ganti Password
        </button>
      </div>

      {/* Notifikasi Toast Feedback */}
      {toast && (
        <div
          className={`mb-5 p-3.5 rounded-lg text-sm font-medium ${
            toast.type === "success"
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {toast.text}
        </div>
      )}

      {/* Main Card Container */}
      <div className="bg-white border border-[#DCE4F0] rounded-xl p-6 md:p-8 shadow-xs">
        {activeTab === "profil" ? (
          /* TAB 1: EDIT PROFIL */
          <form onSubmit={handleSaveProfile}>
            <div className="grid grid-cols-1 md:grid-cols-[170px_1fr] gap-8 items-start">
              {/* Kolom Kiri: Foto Avatar */}
              <div className="flex flex-col items-center">
                <div className="w-36 h-36 rounded-full overflow-hidden bg-[#EEF2FC] border border-[#DCE4F0] flex items-center justify-center p-2.5 shadow-xs">
                  <img
                    src={profile.foto || "/profil.png"}
                    alt="Foto Profil"
                    className="w-full h-full object-contain rounded-full"
                  />
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-4 w-full max-w-[150px] flex items-center justify-center gap-2 px-3 py-2 border border-[#CCD7ED] rounded-lg text-xs md:text-sm font-semibold text-gray-700 hover:bg-gray-50 transition shadow-xs"
                >
                  <ImageIcon size={18} className="text-gray-600" />
                  <span>Ganti Foto</span>
                </button>
              </div>

              {/* Kolom Kanan: Form Data Diri */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-1.5">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    required
                    value={profile.nama}
                    onChange={(e) => setProfile({ ...profile, nama: e.target.value })}
                    placeholder="Shazil Medina"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#CCD7ED] bg-white text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5469D4]/30 focus:border-[#5469D4] transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    placeholder="shazilmedina@aretacollege.ac.id"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#CCD7ED] bg-white text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5469D4]/30 focus:border-[#5469D4] transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-1.5">
                    Nomor Telepon
                  </label>
                  <input
                    type="tel"
                    value={profile.telepon}
                    onChange={(e) => setProfile({ ...profile, telepon: e.target.value })}
                    placeholder="+628 12-8523-4904"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#CCD7ED] bg-white text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5469D4]/30 focus:border-[#5469D4] transition"
                  />
                </div>

                {/* Aksi Simpan & Batal */}
                <div className="flex justify-end gap-3 pt-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-7 py-2.5 bg-[#5469D4] hover:bg-[#475BC5] text-white rounded-lg text-sm font-semibold transition shadow-xs disabled:opacity-50"
                  >
                    {loading ? "Menyimpan..." : "Simpan"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setProfile(initialProfile);
                      setToast(null);
                    }}
                    className="px-6 py-2.5 border border-[#CCD7ED] text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-semibold transition"
                  >
                    Batal
                  </button>
                </div>
              </div>
            </div>
          </form>
        ) : (
          /* TAB 2: GANTI PASSWORD (Struktur 2 Kolom Seimbang) */
          <form onSubmit={handleSavePassword}>
            <div className="grid grid-cols-1 md:grid-cols-[170px_1fr] gap-8 items-start">
              {/* Kolom Kiri: Ikon Keamanan Akun */}
              <div className="flex flex-col items-center">
                <div className="w-36 h-36 rounded-full bg-[#EEF2FC] border border-[#DCE4F0] flex flex-col items-center justify-center p-3 shadow-xs text-[#5469D4]">
                  <KeyRound size={46} strokeWidth={2.2} />
                </div>
                <div className="mt-4 px-3 py-2 bg-[#EEF2FC] text-[#5469D4] rounded-lg text-xs font-semibold text-center w-full max-w-[150px] shadow-xs">
                  Keamanan Akun
                </div>
              </div>

              {/* Kolom Kanan: Form Password */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-1.5">
                    Password Lama
                  </label>
                  <input
                    type="password"
                    required
                    value={password.oldPassword}
                    onChange={(e) => setPassword({ ...password, oldPassword: e.target.value })}
                    placeholder="Masukkan password saat ini"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#CCD7ED] bg-white text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5469D4]/30 focus:border-[#5469D4] transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-1.5">
                    Password Baru
                  </label>
                  <input
                    type="password"
                    required
                    value={password.newPassword}
                    onChange={(e) => setPassword({ ...password, newPassword: e.target.value })}
                    placeholder="Minimal 6 karakter"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#CCD7ED] bg-white text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5469D4]/30 focus:border-[#5469D4] transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-1.5">
                    Konfirmasi Password Baru
                  </label>
                  <input
                    type="password"
                    required
                    value={password.confirmPassword}
                    onChange={(e) => setPassword({ ...password, confirmPassword: e.target.value })}
                    placeholder="Ulangi password baru"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#CCD7ED] bg-white text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5469D4]/30 focus:border-[#5469D4] transition"
                  />
                </div>

                {/* Aksi Simpan & Batal */}
                <div className="flex justify-end gap-3 pt-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-7 py-2.5 bg-[#5469D4] hover:bg-[#475BC5] text-white rounded-lg text-sm font-semibold transition shadow-xs disabled:opacity-50"
                  >
                    {loading ? "Menyimpan..." : "Simpan"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPassword({ oldPassword: "", newPassword: "", confirmPassword: "" });
                      setToast(null);
                    }}
                    className="px-6 py-2.5 border border-[#CCD7ED] text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-semibold transition"
                  >
                    Batal
                  </button>
                </div>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}