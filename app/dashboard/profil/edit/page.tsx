"use client";

import Image from "next/image";
import { HiOutlinePhotograph } from "react-icons/hi";

export default function EditProfil() {
  return (
    <div className="p-8">

      {/* Judul */}
      <h1 className="text-4xl font-bold mb-8">
        Edit Profil
      </h1>

      {/* Card */}
      <div className="bg-white border border-indigo-200 rounded-xl shadow-sm p-10">

        <div className="grid grid-cols-2 gap-16">

          {/* ================= FOTO ================= */}

          <div className="flex flex-col items-center">

            <div className="w-40 h-40 rounded-full overflow-hidden border border-indigo-200">

              <Image
                src="/profil.png"
                alt="Profil"
                width={160}
                height={160}
                className="object-cover"
              />

            </div>

            <button
              className="
              mt-5
              flex
              items-center
              gap-3
              border
              border-indigo-200
              rounded-lg
              px-6
              py-3
              text-lg
              font-medium
              hover:bg-gray-50
              transition
              "
            >
              <HiOutlinePhotograph size={28} />

              Ganti Foto
            </button>

          </div>

          {/* ================= FORM ================= */}

          <div className="space-y-6">

            {/* Nama */}

            <div>

              <label className="block mb-2 font-semibold text-lg">
                Nama Lengkap
              </label>

              <input
                type="text"
                defaultValue="Shazil Medina"
                className="
                w-full
                border
                border-indigo-200
                rounded-lg
                px-5
                py-3
                outline-none
                focus:ring-2
                focus:ring-indigo-400
                "
              />

            </div>

            {/* Email */}

            <div>

              <label className="block mb-2 font-semibold text-lg">
                Email
              </label>

              <input
                type="email"
                defaultValue="shazilmedina@aretacollege.ac.id"
                className="
                w-full
                border
                border-indigo-200
                rounded-lg
                px-5
                py-3
                outline-none
                focus:ring-2
                focus:ring-indigo-400
                "
              />

            </div>

            {/* Telepon */}

            <div>

              <label className="block mb-2 font-semibold text-lg">
                Nomor Telepon
              </label>

              <input
                type="text"
                defaultValue="+628 12-8523-4904"
                className="
                w-full
                border
                border-indigo-200
                rounded-lg
                px-5
                py-3
                outline-none
                focus:ring-2
                focus:ring-indigo-400
                "
              />

            </div>

            {/* Button */}

            <div className="flex justify-end gap-4 pt-6">

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
                Simpan
              </button>

              <button
                className="
                border
                border-indigo-200
                px-10
                py-3
                rounded-lg
                font-semibold
                hover:bg-gray-100
                transition
                "
              >
                Batal
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}