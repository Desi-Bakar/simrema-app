import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-gray-100 flex flex-col">
      
      {/* Navbar */}
      <nav className="flex justify-between items-center px-10 py-4 bg-white shadow">
        <div className="flex items-center space-x-2">
          <a href="/">
          <img src="/simremalogo.png" alt="logo" className="h-10" />
          </a>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">
            Selamat Datang Dosen
          </span>
          <img src="/profil.png" alt="logo" className="h-10" />
        </div>
      </nav>

      {/* Login Card */}
      <div className="flex flex-1 items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md w-[400px]">
          
          <h2 className="text-xl font-bold mb-6 text-center">LOGIN</h2>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              placeholder="Email"
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="block text-sm mb-1">Password</label>
            <input
              type="password"
              placeholder="Password"
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {/* Button */}
          <button className="w-full bg-blue-600 text-white py-2 rounded mb-3">
            Login
          </button>

          {/* Footer */}
          <div className="flex justify-between text-sm">
            <a href="#" className="text-blue-500">
              Lupa Password?
            </a>
            <a href="#" className="text-green-500">
              Daftar Akun
            </a>
          </div>

        </div>
      </div>

    </main>
  );
}