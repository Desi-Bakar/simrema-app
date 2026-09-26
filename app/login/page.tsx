"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "../components/navbar";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Gagal masuk ke sistem.");
      }

      // Simpan session di localStorage untuk client component
      localStorage.setItem("user", JSON.stringify(data.user));

      // Redirect ke dashboard
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Login Card */}
      <div className="flex flex-1 items-center justify-center p-4">
        <div className="bg-white shadow-md rounded-xl w-full max-w-[900px] p-8 flex flex-col md:flex-row gap-10">
          <div className="w-full md:w-[400px]">
            <h2 className="text-2xl font-bold mb-2">Login SIMREMA</h2>
            <p className="text-sm text-gray-500 mb-6">
              Masuk untuk mengelola materi perkuliahan Anda.
            </p>

            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label className="block text-sm mb-1 text-zinc-600 font-medium">
                  Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="admin@simrema.ac.id atau email dosen"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm mb-1 text-zinc-600 font-medium">
                  Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="Masukkan password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2.5 rounded-lg mb-4 hover:bg-blue-700 transition font-medium disabled:opacity-50"
              >
                {loading ? "Memproses..." : "Login"}
              </button>
            </form>

            <div className="flex justify-between text-sm pt-2 border-t">
              <Link href="/lupa-password" className="text-blue-500 hover:underline">
                Lupa Password?
              </Link>
              <Link href="/request-access" className="text-green-600 font-medium hover:underline">
                Request Access
              </Link>
            </div>
          </div>

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
    </main>
  );
}