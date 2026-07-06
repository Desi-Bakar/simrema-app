
import Image from "next/image";

export default function ProfilePage() {
  return (
    <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6">
      {/* Foto Profil */}
      <div className="flex flex-col items-center">
        <Image
          src="/profile.jpg" // ganti dengan path image dosen
          alt="Foto Dosen"
          width={120}
          height={120}
          className="rounded-full border-2 border-gray-300"
        />
        {/* Nama Dosen */}
        <h2 className="mt-4 text-xl font-semibold text-gray-800">
          Nama Dosen
        </h2>
        {/* Email */}
        <p className="text-gray-600">dosen@example.com</p>
        <p className="text-gray-600">00000000000</p>
      </div>

      {/* Tombol Aksi */}
      <div className="mt-6 flex flex-row gap-3">
        <button className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition">
          Edit Profil
        </button>
        <button className="w-full bg-gray-500 text-white py-2 rounded hover:bg-gray-600 transition">
          Ganti Password
        </button>
      </div>
    </div>
  );
}

