import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-10 py-4 bg-white shadow">
        <div className="flex items-center space-x-2">
          <Image
            src="/simremalogo.png"
            alt="Simrema Logo"
            width={160}
            height={40}
            priority
            className="w-40 h-auto"
          />
        </div>
        <div className="space-x-4">
          <Link
            href="/login"
            className="px-4 py-2 bg-blue-500 text-white rounded inline-block"
          >
            Login
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex items-center justify-between px-10 py-20">
        {/* Kiri */}
        <div className="max-w-xl">
          <h2 className="text-6xl font-bold text-gray-800 mb-4">
            Aplikasi Rekap <br /> Materi Ajar Dosen
          </h2>
          <p className="text-gray-600 mb-8">
            Kelola materi perkuliahan secara digital dan rapi.
          </p>
          <div className="space-x-4">
            <Link
              href="/login"
              className="px-6 py-2 bg-blue-500 text-white rounded-lg inline-block"
            >
              Login
            </Link>

            <Link
              href="/request-access"
              className="px-6 py-2 bg-green-500 text-white rounded-lg inline-block"
            >
              Request Access
            </Link>
          </div>
        </div>
        {/* Kanan (Gambar) */}
        <div>
          <Image
            src="/ilustrasihome.png"
            alt="ilustrasihome"
            width={800}
            height={550}
            priority
            className="w-[800px] h-auto object-contain"
          />
        </div>
      </section>
    </main>
  );
}
