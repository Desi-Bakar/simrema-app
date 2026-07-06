"use client";

import Image from "next/image";
import Link from "next/link";

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-[#F6F8FF]">

      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between py-5 px-6">

          <Image
            src="/logo.png"
            alt="SIMREMA"
            width={150}
            height={45}
          />

          <Link
            href="/login"
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-7 py-2 rounded-md text-sm font-medium"
          >
            Login
          </Link>

        </div>
      </header>

      {/* Content */}

      <div className="flex justify-center items-center py-20">

        <div className="bg-white rounded-xl border border-indigo-100 shadow-sm w-[900px] p-10">

          <div className="grid md:grid-cols-2 gap-10 items-center">

            {/* Form */}

            <div>

              <h1 className="text-4xl font-bold mb-4">
                Lupa Password
              </h1>

              <p className="text-gray-500 leading-7 mb-8">
                Masukkan alamat email Anda untuk mendapatkan tautan reset password.
              </p>

              <input
                type="email"
                placeholder="Email"
                className="w-full border border-indigo-200 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-400"
              />

              <button
                className="w-full mt-5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg py-3 font-semibold"
              >
                KIRIM LINK RESET
              </button>

              <div className="mt-6 text-center">

                <Link
                  href="/login"
                  className="text-green-600 font-semibold hover:underline"
                >
                  Kembali ke Login
                </Link>

              </div>

            </div>

            {/* Gambar */}

            <div className="flex justify-center">

              <Image
                src="/lupapassword.png"
                alt="Forgot Password"
                width={770}
                height={770}
              />

            </div>

          </div>

        </div>

      </div>

      {/* Footer */}

      <footer className="text-center text-gray-500 pb-6">
        ©2025 | Aplikasi Rekap Materi Mengajar Dosen.
      </footer>

    </div>
  );
}