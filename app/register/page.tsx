import Image from "next/image";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-gray-100 flex flex-col">
      
      {/* Navbar */}
      <nav className="flex justify-between items-center px-10 py-4 bg-white shadow-sm">
        <a href="/">
            <img src="/simremalogo.png" alt="logo" className="h-10" />
        </a>
        

        <Link href="/login">
          <button className="bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600">
            Login
          </button>
        </Link>
      </nav>

      {/* Content */}
      <div className="flex flex-1 items-center justify-center">
        <div className="bg-white shadow-md rounded-xl w-[900px] p-8 flex gap-10">
          
          {/* Form */}
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-6">Daftar Akun</h2>

            <form className="space-y-4">
              
              <div>
                <label className="block text-sm mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  placeholder="Nama lengkap"
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Email</label>
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">NIDN</label>
                <input
                  type="text"
                  placeholder="NIDN"
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Password</label>
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
              >
                Daftar
              </button>
            </form>

            <p className="text-sm text-gray-500 mt-4 text-center">
              Sudah punya akun?{" "}
              <Link href="/login" className="text-blue-500 font-medium">
                Login
              </Link>
            </p>
          </div>

          {/* Illustration */}
          <div className="flex-1 flex items-center justify-center">
            <Image
                src="/request.png"
                alt="Illustration"
                width={500}
                height={500}
                className="object-contain"
            />
            </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center text-sm text-gray-500 py-4">
        ©2025 | Aplikasi Rekap Materi Mengajar Dosen.
      </footer>
    </main>
  );
}