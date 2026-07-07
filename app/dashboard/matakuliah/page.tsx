"use client";

import Link from "next/link";

const dataMateri = [
  {
    tanggal: "01/01/2026",
    matkul: "MikroTik",
    pertemuan: 3,
    materi: "IP Address",
  },
  {
    tanggal: "01/01/2026",
    matkul: "CISCO",
    pertemuan: 6,
    materi: "Routing",
  },
  {
    tanggal: "01/01/2026",
    matkul: "Linux Server",
    pertemuan: 9,
    materi: "Perintah Dasar CLI",
  },
  {
    tanggal: "01/01/2026",
    matkul: "Docker",
    pertemuan: 4,
    materi: "Container",
  },
  {
    tanggal: "01/01/2026",
    matkul: "Python",
    pertemuan: 6,
    materi: "Library Kunci",
  },
];

export default function RekapPage() {
  return (
    <div className="p-8">

      {/* Header */}
      <div className="flex justify-between items-center mb-8">

        <h1 className="text-4xl font-bold">
          Rekap Mata Kuliah
        </h1>

        <Link
          href="/dashboard/rekap"
          className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg font-semibold"
        >
          + Tambah Materi
        </Link>

      </div>

      {/* Table */}

      <div className="bg-white rounded-xl border border-indigo-200 overflow-hidden shadow-sm">

        <table className="w-full">

          <thead className="bg-gray-50">

            <tr>

              <th className="py-4 px-6 text-left">Tanggal</th>

              <th className="py-4 px-6 text-left">Mata Kuliah</th>

              <th className="py-4 px-6 text-center">Pertemuan</th>

              <th className="py-4 px-6 text-left">Materi</th>

              <th className="py-4 px-6 text-center">Aksi</th>

            </tr>

          </thead>

          <tbody>

            {dataMateri.map((item, index) => (

              <tr
                key={index}
                className="border-t hover:bg-gray-50"
              >

                <td className="px-6 py-4">
                  {item.tanggal}
                </td>

                <td className="px-6 py-4">
                  {item.matkul}
                </td>

                <td className="px-6 py-4 text-center">
                  {item.pertemuan}
                </td>

                <td className="px-6 py-4">
                  {item.materi}
                </td>

                <td className="px-6 py-4 text-center">

                  <Link
                    href="/dashboard/rekap/detail"
                    className="bg-indigo-500 hover:bg-indigo-600 text-white px-5 py-2 rounded-lg"
                  >
                    Lihat
                  </Link>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      {/* Footer Table */}

      <div className="flex justify-between items-center mt-6">

        <p className="text-gray-500">
          Menampilkan 1 hingga 4 dari 7 data
        </p>

        <div className="flex gap-2">

          <button className="border rounded-lg w-10 h-10">
            &lt;
          </button>

          <button className="bg-indigo-500 text-white rounded-lg w-10 h-10">
            1
          </button>

          <button className="border rounded-lg w-10 h-10">
            3
          </button>

          <button className="border rounded-lg w-10 h-10">
            &gt;
          </button>

        </div>

      </div>

    </div>
  );
}