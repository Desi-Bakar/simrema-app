// "use client";

// import Link from "next/link";
// import { useEffect, useState } from "react";
// import { ClipboardList } from "lucide-react";

// type RekapRow = {
//   id: string;
//   tanggal: string;
//   pertemuan: number;
//   materi: string;
//   tugas?: string | null;
//   mataKuliah?: { id: string; nama: string };
// };

// function formatDate(d: string | Date) {
//   const date = new Date(d);
//   if (isNaN(date.getTime())) return "-";
//   const day = String(date.getDate()).padStart(2, "0");
//   const month = String(date.getMonth() + 1).padStart(2, "0");
//   const year = date.getFullYear();
//   return `${day}/${month}/${year}`;
// }

// export default function RekapTable() {
//   const [data, setData] = useState<RekapRow[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [page, setPage] = useState(1);
//   const pageSize = 5;

//   const fetchRekap = async () => {
//     try {
//       const stored = localStorage.getItem("user");
//       const user = stored ? JSON.parse(stored) : null;
//       // Admin: fetch semua tanpa email filter. Dosen: fetch hanya punya dia
//       const params = new URLSearchParams();
//       if (user?.role === "DOSEN" && user?.email) {
//         params.append("email", user.email);
//       }
//       params.append("role", user?.role || "DOSEN");
      
//       const res = await fetch(`/api/materi?${params.toString()}`);
//       const json = await res.json();
//       if (json.success && Array.isArray(json.data)) {
//         setData(json.data);
//       }
//     } catch {
//       // ignore
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchRekap();
//   }, []);

//   const handleDelete = async (id: string, pertemuan: number) => {
//     if (!confirm(`Apakah Anda yakin ingin menghapus materi pertemuan ${pertemuan}?`)) return;
//     try {
//       const res = await fetch(`/api/materi?id=${id}`, { method: "DELETE" });
//       if (res.ok) {
//         setData((prev) => prev.filter((item) => item.id !== id));
//       } else {
//         alert("Gagal menghapus materi.");
//       }
//     } catch {
//       alert("Terjadi kesalahan koneksi.");
//     }
//   };

//   const totalPages = Math.max(1, Math.ceil(data.length / pageSize));
//   const rows = data.slice((page - 1) * pageSize, page * pageSize);

//   return (
//     <div className="w-full space-y-6">
//       {/* Header persis gambar */}
//       <div className="flex justify-between items-center">
//         <h1 className="text-3xl font-bold text-black tracking-tight">Rekap Mata Kuliah</h1>
//         <Link
//           href="/dashboard/rekap/tambah"
//           className="inline-flex items-center justify-center bg-[#3BB75E] hover:bg-[#34a353] text-white font-semibold text-base px-6 py-2.5 rounded-xl transition shadow-xs"
//         >
//           <span>+ Tambah Materi</span>
//         </Link>
//       </div>

//       {/* Tabel Cardbox persis gambar */}
//       <div className="w-full bg-white border border-[#D5E1F9] rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.02)] overflow-hidden">
//         {loading ? (
//           <div className="p-10 text-center text-sm text-gray-500">Memuat rekap materi...</div>
//         ) : data.length === 0 ? (
//           <div className="p-12 text-center space-y-2">
//             <ClipboardList size={32} className="mx-auto text-gray-400" />
//             <h3 className="text-base font-semibold text-gray-700">Belum Ada Rekap Materi</h3>
//             <p className="text-xs text-gray-500">Belum ada catatan pertemuan yang tersimpan.</p>
//           </div>
//         ) : (
//           <div className="overflow-x-auto w-full">
//             <table className="w-full border-collapse">
//               <thead>
//                 <tr className="bg-white border-b border-[#E8EFFC] text-[#374151] font-semibold text-sm">
//                   <th className="py-4 px-6 border-r border-[#E8EFFC] text-center w-[16%]">Tanggal</th>
//                   <th className="py-4 px-6 border-r border-[#E8EFFC] text-center w-[20%]">Mata Kuliah</th>
//                   <th className="py-4 px-6 border-r border-[#E8EFFC] text-center w-[16%]">Pertemuan</th>
//                   <th className="py-4 px-6 border-r border-[#E8EFFC] text-center w-[24%]">Materi</th>
//                   <th className="py-4 px-6 text-center w-[24%]">Aksi</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-[#E8EFFC] text-[#4B5563] text-sm">
//                 {rows.map((item) => (
//                   <tr key={item.id} className="hover:bg-[#F9FBFF] transition-colors">
//                     <td className="py-4 px-6 border-r border-[#E8EFFC] text-center whitespace-nowrap text-[#4B5563]">
//                       {formatDate(item.tanggal)}
//                     </td>
//                     <td className="py-4 px-6 border-r border-[#E8EFFC] text-center text-[#4B5563]">
//                       {item.mataKuliah?.nama || "-"}
//                     </td>
//                     <td className="py-4 px-6 border-r border-[#E8EFFC] text-center text-[#4B5563]">
//                       {item.pertemuan}
//                     </td>
//                     <td className="py-4 px-6 border-r border-[#E8EFFC] text-center text-[#4B5563]">
//                       {item.materi}
//                     </td>
//                     <td className="py-4 px-6 text-center whitespace-nowrap">
//                       <div className="flex items-center justify-center gap-2.5">
//                         <Link
//                           href={`/dashboard/rekap/id?matkulId=${item.mataKuliah?.id || ""}&matkulNama=${encodeURIComponent(item.mataKuliah?.nama || "")}`}
//                           className="w-[74px] py-2 text-center text-xs font-semibold text-white bg-[#5068DE] hover:bg-[#4359cb] rounded-lg transition shadow-xs inline-block"
//                         >
//                           Lihat
//                         </Link>
//                         <button
//                           type="button"
//                           onClick={() => handleDelete(item.id, item.pertemuan)}
//                           className="w-[74px] py-2 text-center text-xs font-semibold text-white bg-[#D81A1A] hover:bg-[#bd1414] rounded-lg transition shadow-xs inline-block"
//                         >
//                           Hapus
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>

//       {/* Pagination Footer di luar cardbox persis seperti gambar */}
//       {!loading && data.length > 0 && (
//         <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-1">
//           <span className="text-gray-500 text-sm">
//             Menampilkan {(page - 1) * pageSize + 1} hingga {Math.min(page * pageSize, data.length)} dari {data.length} data
//           </span>
//           <div className="flex items-center gap-2">
//             <button
//               onClick={() => setPage((p) => Math.max(p - 1, 1))}
//               disabled={page === 1}
//               className="w-10 h-10 flex items-center justify-center border border-[#CAD8F8] bg-white rounded-lg text-sm font-bold text-[#374151] hover:bg-gray-50 disabled:opacity-40 transition shadow-xs"
//               aria-label="Previous Page"
//             >
//               &lt;
//             </button>
//             {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
//               <button
//                 key={p}
//                 onClick={() => setPage(p)}
//                 className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-bold transition ${
//                   page === p
//                     ? "bg-[#5068DE] text-white shadow-xs"
//                     : "border border-[#CAD8F8] bg-white text-[#374151] hover:bg-gray-50"
//                 }`}
//               >
//                 {p}
//               </button>
//             ))}
//             <button
//               onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
//               disabled={page === totalPages}
//               className="w-10 h-10 flex items-center justify-center border border-[#CAD8F8] bg-white rounded-lg text-sm font-bold text-[#374151] hover:bg-gray-50 disabled:opacity-40 transition shadow-xs"
//               aria-label="Next Page"
//             >
//               &gt;
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


// dari no 1-194 ini adalah codingan yang lama, sebelum direvisi


"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ClipboardList, FileText } from "lucide-react";

type RekapRow = {
  id: string;
  tanggal: string;
  pertemuan: number;
  materi: string;
  tugas?: string | null;
  tahunAjaran?: string | null;
  semester?: string | null;
  fileUrl?: string | null;
  fileName?: string | null;
  mataKuliah?: {
    id: string;
    nama: string;
  };
};

function formatDate(d: string | Date) {
  const date = new Date(d);

  if (isNaN(date.getTime())) return "-";

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

export default function RekapTable() {
  const [data, setData] = useState<RekapRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  // Filter dropdown
  const [tahunAjaran, setTahunAjaran] = useState("");
  const [semester, setSemester] = useState("");
  const [matkulId, setMatkulId] = useState("");

  const pageSize = 5;

  // Mengambil data dari API
  const fetchRekap = async () => {
    try {
      const stored = localStorage.getItem("user");
      const user = stored ? JSON.parse(stored) : null;

      const params = new URLSearchParams();

      if (user?.role === "DOSEN" && user?.email) {
        params.append("email", user.email);
      }

      params.append("role", user?.role || "DOSEN");

      const res = await fetch(`/api/materi?${params.toString()}`);
      const json = await res.json();

      if (json.success && Array.isArray(json.data)) {
        setData(json.data);
      }
    } catch (error) {
      console.error("Gagal mengambil data rekap:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRekap();
  }, []);

  // Pilihan dropdown diambil dari data database
  const tahunOptions = useMemo(() => {
    return Array.from(
      new Set(
        data
          .map((item) => item.tahunAjaran)
          .filter((item): item is string => Boolean(item))
      )
    ).sort();
  }, [data]);

  const matkulOptions = useMemo(() => {
    const unique = new Map<string, string>();

    data.forEach((item) => {
      if (item.mataKuliah) {
        unique.set(item.mataKuliah.id, item.mataKuliah.nama);
      }
    });

    return Array.from(unique.entries());
  }, [data]);

  // Filter data berdasarkan dropdown
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const cocokTahun =
        !tahunAjaran || item.tahunAjaran === tahunAjaran;

      const cocokSemester =
        !semester ||
        item.semester?.toLowerCase() === semester.toLowerCase();

      const cocokMatkul =
        !matkulId || item.mataKuliah?.id === matkulId;

      return cocokTahun && cocokSemester && cocokMatkul;
    });
  }, [data, tahunAjaran, semester, matkulId]);

  // Reset halaman ketika filter berubah
  const handleFilterChange = (
    type: "tahun" | "semester" | "matkul",
    value: string
  ) => {
    setPage(1);

    if (type === "tahun") setTahunAjaran(value);
    if (type === "semester") setSemester(value);
    if (type === "matkul") setMatkulId(value);
  };

  // Hapus materi
  const handleDelete = async (id: string, pertemuan: number) => {
    if (
      !confirm(
        `Apakah Anda yakin ingin menghapus materi pertemuan ${pertemuan}?`
      )
    ) {
      return;
    }

    try {
      const res = await fetch(`/api/materi?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setData((prev) => prev.filter((item) => item.id !== id));
      } else {
        alert("Gagal menghapus materi.");
      }
    } catch {
      alert("Terjadi kesalahan koneksi.");
    }
  };

  // Pagination
  const totalPages = Math.max(
    1,
    Math.ceil(filteredData.length / pageSize)
  );

  const rows = filteredData.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  return (
    <div className="w-full space-y-5">

      {/* Judul dan tombol tambah */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl md:text-3xl font-bold text-black tracking-tight">
          Rekap Mata Kuliah
        </h1>

        <Link
          href="/dashboard/rekap/tambah"
          className="inline-flex items-center justify-center bg-[#3BB75E] hover:bg-[#34a353] text-white font-semibold text-sm md:text-base px-5 py-2.5 rounded-xl transition shadow-sm"
        >
          + Tambah Materi
        </Link>
      </div>

      {/* FILTER TAHUN AJARAN, SEMESTER, MATA KULIAH */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-[#F0F3FF] border border-[#D5E1F9] rounded-xl p-3 shadow-sm">

        {/* Dropdown Tahun Ajaran */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-600">
            Tahun Ajaran
          </label>

          <select
            value={tahunAjaran}
            onChange={(e) =>
              handleFilterChange("tahun", e.target.value)
            }
            className="w-full bg-white border border-[#E0E7F5] rounded-lg px-3 py-2 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-[#5068DE]"
          >
            <option value="">Semua Tahun Ajaran</option>

            {tahunOptions.map((tahun) => (
              <option key={tahun} value={tahun}>
                {tahun}
              </option>
            ))}
          </select>
        </div>

        {/* Dropdown Semester */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-600">
            Semester
          </label>

          <select
            value={semester}
            onChange={(e) =>
              handleFilterChange("semester", e.target.value)
            }
            className="w-full bg-white border border-[#E0E7F5] rounded-lg px-3 py-2 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-[#5068DE]"
          >
            <option value="">Semua Semester</option>
            <option value="Ganjil">Ganjil</option>
            <option value="Genap">Genap</option>
          </select>
        </div>

        {/* Dropdown Mata Kuliah */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-600">
            Mata Kuliah
          </label>

          <select
            value={matkulId}
            onChange={(e) =>
              handleFilterChange("matkul", e.target.value)
            }
            className="w-full bg-white border border-[#E0E7F5] rounded-lg px-3 py-2 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-[#5068DE]"
          >
            <option value="">Semua Mata Kuliah</option>

            {matkulOptions.map(([id, nama]) => (
              <option key={id} value={id}>
                {nama}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* TABEL REKAP MATERI */}
      <div className="w-full bg-white border border-[#D5E1F9] rounded-xl shadow-sm overflow-hidden">

        {loading ? (
          <div className="p-10 text-center text-sm text-gray-500">
            Memuat rekap materi...
          </div>
        ) : filteredData.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <ClipboardList
              size={32}
              className="mx-auto text-gray-400"
            />

            <h3 className="text-base font-semibold text-gray-700">
              Belum Ada Rekap Materi
            </h3>

            <p className="text-xs text-gray-500">
              Tidak ada materi yang sesuai dengan filter pilihan.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="w-full min-w-225 border-collapse">

              <thead>
                <tr className="bg-white border-b border-[#E8EFFC] text-[#374151] font-semibold text-sm">

                  <th className="py-3 px-4 border-r border-[#E8EFFC] text-center">
                    Tanggal
                  </th>

                  <th className="py-3 px-4 border-r border-[#E8EFFC] text-center">
                    Mata Kuliah
                  </th>

                  <th className="py-3 px-4 border-r border-[#E8EFFC] text-center">
                    Pertemuan
                  </th>

                  <th className="py-3 px-4 border-r border-[#E8EFFC] text-center">
                    Materi
                  </th>

                  <th className="py-3 px-4 border-r border-[#E8EFFC] text-center">
                    File Materi
                  </th>

                  <th className="py-3 px-4 text-center">
                    Aksi
                  </th>

                </tr>
              </thead>

              <tbody className="divide-y divide-[#E8EFFC] text-[#4B5563] text-sm">

                {rows.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-[#F9FBFF] transition-colors"
                  >

                    <td className="py-3 px-4 border-r border-[#E8EFFC] text-center whitespace-nowrap">
                      {formatDate(item.tanggal)}
                    </td>

                    <td className="py-3 px-4 border-r border-[#E8EFFC] text-center">
                      {item.mataKuliah?.nama || "-"}
                    </td>

                    <td className="py-3 px-4 border-r border-[#E8EFFC] text-center">
                      {item.pertemuan}
                    </td>

                    <td className="py-3 px-4 border-r border-[#E8EFFC] text-center">
                      {item.materi}
                    </td>

                    {/* File Materi */}
                    <td className="py-3 px-4 border-r border-[#E8EFFC] text-center">
                      {item.fileUrl ? (
                        <a
                          href={item.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-1.5 text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          <FileText
                            size={15}
                            className="text-red-500"
                          />
                          <span className="text-xs">
                            {item.fileName || "materi.pdf"}
                          </span>
                        </a>
                      ) : (
                        <span className="text-xs text-gray-400">
                          Tidak ada file
                        </span>
                      )}
                    </td>

                    {/* Tombol Aksi */}
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-2">

                        <Link
                          href={`/dashboard/rekap/id?matkulId=${item.mataKuliah?.id || ""}&matkulNama=${encodeURIComponent(item.mataKuliah?.nama || "")}`}
                          className="w-14.5 py-1.5 text-center text-xs font-semibold text-white bg-[#5068DE] hover:bg-[#4359cb] rounded-md transition inline-block"
                        >
                          Lihat
                        </Link>

                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(item.id, item.pertemuan)
                          }
                          className="w-14.5 py-1.5 text-center text-xs font-semibold text-white bg-[#D81A1A] hover:bg-[#bd1414] rounded-md transition inline-block"
                        >
                          Hapus
                        </button>

                      </div>
                    </td>

                  </tr>
                ))}

              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* PAGINATION */}
      {!loading && filteredData.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-1">

          <span className="text-gray-500 text-sm">
            Menampilkan{" "}
            {(page - 1) * pageSize + 1} hingga{" "}
            {Math.min(page * pageSize, filteredData.length)} dari{" "}
            {filteredData.length} data
          </span>

          <div className="flex items-center gap-2">

            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="w-9 h-9 flex items-center justify-center border border-[#CAD8F8] bg-white rounded-lg text-sm font-bold text-[#374151] hover:bg-gray-50 disabled:opacity-40 transition"
            >
              &lt;
            </button>

            {Array.from(
              { length: totalPages },
              (_, i) => i + 1
            ).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-bold transition ${
                  page === p
                    ? "bg-[#5068DE] text-white shadow-sm"
                    : "border border-[#CAD8F8] bg-white text-[#374151] hover:bg-gray-50"
                }`}
              >
                {p}
              </button>
            ))}

            <button
              onClick={() =>
                setPage((p) => Math.min(p + 1, totalPages))
              }
              disabled={page === totalPages}
              className="w-9 h-9 flex items-center justify-center border border-[#CAD8F8] bg-white rounded-lg text-sm font-bold text-[#374151] hover:bg-gray-50 disabled:opacity-40 transition"
            >
              &gt;
            </button>

          </div>
        </div>
      )}

    </div>
  );
}
