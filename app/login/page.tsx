
import Image from "next/image";
import Navbar from "../components/navbar";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-gray-100 flex flex-col">
      {/* Navbar */}
      <Navbar />
      {/* Login Card */}
      <div className="flex flex-1 items-center justify-center">
        <div className="bg-white shadow-md rounded-xl w-[900px] p-8 flex gap-10">
        <div className=" w-[400px]">
          <h2 className="text-xl font-bold mb-6">Login</h2>
          <div className="mb-4">
            <label className="block text-sm mb-1 text-zinc-500">Email</label>
            <input
              type="email"
              placeholder="Email"
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm mb-1 text-zinc-500">Password</label>
            <input
              type="password"
              placeholder="Password"
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <button className="w-full bg-blue-600 text-white py-2 rounded mb-3">
            Login
          </button>
          <div className="flex justify-between text-sm">
            <a href="/lupapassword" className="text-blue-500">
              Lupa Password?
            </a>
            <a href="/register" className="text-green-500">
              Request access
            </a>
          </div>
        </div>
        <div className=" hidden md:block flex-1 flex items-center justify-center">
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
    </main>
  );
}