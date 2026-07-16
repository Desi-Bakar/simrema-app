"use client";

import Image from "next/image";
import Link from "next/link";

export default function ProfilPage() {
  return (
    <div className="p-8">

      {/* Judul */}
      <h1 className="text-3xl font-bold mb-8">
        Profil
      </h1>

      {/* Card */}
      <div className="bg-white rounded-xl border border-indigo-200 shadow-sm">

        <div className="flex flex-col items-center py-10">

          {/* Foto */}
          <div className="w-44 h-44 rounded-full border border-indigo-200 overflow-hidden">

            <Image
              src="/profil.png"
              alt="profil"
              width={176}
              height={176}
              className="object-cover"
            />

          </div>

          {/* Nama */}
          <h2 className="text-4xl font-bold mt-6">
            Shazil Medina
          </h2>

          {/* Email */}
          <p className="text-gray-500 mt-2">
            shazilmedina@aretacollege.ac.id
          </p>

          {/* NIDN */}
          <p className="text-gray-500 mb-8">
            491204129412
          </p>

          {/* Button */}
          <div className="flex gap-4">
            <Link href="profil/edit">
              <button
                className="
                bg-indigo-500
                hover:bg-indigo-600
                text-white
                px-10
                py-3
                rounded-lg
                font-semibold
                transition
              "
              >
                Edit Profil
              </button>
            </Link>

            <button
              className="
              border
              border-indigo-300
              text-gray-700
              hover:bg-gray-100
              px-8
              py-3
              rounded-lg
              font-semibold
              transition
            "
            >
              Ganti Password
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}