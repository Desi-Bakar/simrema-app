// "use client";

// import { Suspense, useState, useEffect } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { ArrowLeft } from "lucide-react";

// function EditMateriContent() {
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   const [form, setForm] = useState({
//     id: "",
//     mataKuliahId: "",
//     tanggal: "",
//     pertemuan: "1",
//     materi: "",
//     tugas: "",
//   });

//   const [matkuls, setMatkuls] = useState<Array<{ id: string; nama: string }>>([]);
//   const [loading, setLoading] = useState(false);
//   const [success, setSuccess] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     try {
//       const stored = localStorage.getItem("user");
//       const user = stored ? JSON.parse(stored) : null;
//       fetch(`/api/matakuliah?email=${encodeURIComponent(user?.email || "")}&role=${user?.role || "DOSEN"}`)
//         .then((r) => r.json())
//         .then((j) => {
//           if (j.success && Array.isArray(j.data)) setMatkuls(j.data);
//         });
//     } catch {}

//     const qId = searchParams.get("id") || "";
//     const qMatkulId = searchParams.get("matkulId") || searchParams.get("mataKuliahId") || "";
//     const qTanggal = searchParams.get("tanggal") || "";
//     const qPertemuan = searchParams.get("pertemuan") || "1";
//     const qMateri = searchParams.get("materi") || "";
//     const qTugas = searchParams.get("tugas") || "";

//     setForm({
//       id: qId,
//       mataKuliahId: qMatkulId,
//       tanggal: qTanggal,
//       pertemuan: qPertemuan,
//       materi: qMateri,
//       tugas: qTugas,
//     });
//   }, [searchParams]);

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
//   ) => {
//     setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//     if (error) setError(null);
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);

//     try {
//       const res = await fetch("/api/materi", {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           id: form.id || undefined,
//           mataKuliahId: form.mataKuliahId || undefined,
//           pertemuan: Number(form.pertemuan),
//           tanggal: form.tanggal ? new Date(form.tanggal).toISOString() : undefined,
//           materi: form.materi,
//           tugas: form.tugas,
//         }),
//       });

//       if (res.ok) {
//         setSuccess(true);
//         setTimeout(() => {
//           if (form.mataKuliahId) {
//             router.push(`/dashboard/rekap/id?matkulId=${form.mataKuliahId}`);
//           } else {
//             router.push("/dashboard/rekap");
//           }
//         }, 1000);
//       } else {
//         const j = await res.json().catch(() => ({}));
//         setError(j.message || "Gagal memperbarui materi ajar.");
//       }
//     } catch {
//       setError("Terjadi kesalahan koneksi.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-5">
//       {success && (
//         <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
//           Materi ajar berhasil diperbarui. Mengalihkan...
//         </div>
//       )}

//       {error && (
//         <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
//           {error}
//         </div>
//       )}

//       {matkuls.length > 0 && (
//         <div>
//           <label htmlFor="mataKuliahId" className="block text-sm font-bold text-[#2D3748] mb-2">
//             Mata Kuliah
//           </label>
//           <select
//             id="mataKuliahId"
//             name="mataKuliahId"
//             value={form.mataKuliahId}
//             onChange={handleChange}
//             className="w-full px-4 py-2.5 rounded-lg border border-[#CCD7ED] bg-white text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#5469D4]/30"
//           >
//             <option value="">Pilih Mata Kuliah</option>
//             {matkuls.map((m) => (
//               <option key={m.id} value={m.id}>
//                 {m.nama}
//               </option>
//             ))}
//           </select>
//         </div>
//       )}

//       <div>
//         <label htmlFor="tanggal" className="block text-sm font-bold text-[#2D3748] mb-2">
//           Tanggal
//         </label>
//         <input
//           id="tanggal"
//           type="date"
//           name="tanggal"
//           required
//           value={form.tanggal}
//           onChange={handleChange}
//           className="w-full px-4 py-2.5 rounded-lg border border-[#CCD7ED] bg-white text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#5469D4]/30 focus:border-[#5469D4] transition"
//         />
//       </div>

//       <div>
//         <label htmlFor="pertemuan" className="block text-sm font-bold text-[#2D3748] mb-2">
//           Pertemuan
//         </label>
//         <input
//           id="pertemuan"
//           type="number"
//           min={1}
//           name="pertemuan"
//           required
//           value={form.pertemuan}
//           onChange={handleChange}
//           placeholder="1"
//           className="w-full px-4 py-2.5 rounded-lg border border-[#CCD7ED] bg-white text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#5469D4]/30 focus:border-[#5469D4] transition"
//         />
//       </div>

//       <div>
//         <label htmlFor="materi" className="block text-sm font-bold text-[#2D3748] mb-2">
//           Materi
//         </label>
//         <textarea
//           id="materi"
//           name="materi"
//           required
//           rows={3}
//           value={form.materi}
//           onChange={handleChange}
//           placeholder="Tuliskan materi pembelajaran..."
//           className="w-full px-4 py-2.5 rounded-lg border border-[#CCD7ED] bg-white text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#5469D4]/30 focus:border-[#5469D4] transition resize-y"
//         />
//       </div>

//       <div>
//         <label htmlFor="tugas" className="block text-sm font-bold text-[#2D3748] mb-2">
//           Tugas
//         </label>
//         <input
//           id="tugas"
//           type="text"
//           name="tugas"
//           value={form.tugas}
//           onChange={handleChange}
//           placeholder="Penugasan (opsional)"
//           className="w-full px-4 py-2.5 rounded-lg border border-[#CCD7ED] bg-white text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#5469D4]/30 focus:border-[#5469D4] transition"
//         />
//       </div>

//       <div className="flex justify-end items-center gap-3 pt-4">
//         <button
//           type="submit"
//           disabled={loading}
//           className="px-8 py-2.5 bg-[#52C463] hover:bg-[#43ad53] text-white rounded-lg text-sm font-semibold transition shadow-xs disabled:opacity-50"
//         >
//           {loading ? "Menyimpan..." : "Simpan Perubahan"}
//         </button>
//         <button
//           type="button"
//           onClick={() => router.back()}
//           className="px-8 py-2.5 border border-[#CCD7ED] text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-semibold transition"
//         >
//           Batal
//         </button>
//       </div>
//     </form>
//   );
// }

// export default function EditMateriPage() {
//   const router = useRouter();

//   return (
//     <div className="w-full max-w-4xl mx-auto space-y-6">
//       <div className="flex items-center gap-3">
//         <button
//           type="button"
//           onClick={() => router.back()}
//           className="p-2 bg-white border border-[#DCE4F0] rounded-lg hover:bg-gray-50 text-gray-600 transition shadow-xs"
//           aria-label="Kembali"
//         >
//           <ArrowLeft size={20} />
//         </button>
//         <h1 className="text-2xl md:text-3xl font-bold text-[#2D3748]">
//           Edit Materi Ajar
//         </h1>
//       </div>

//       <div className="bg-white border border-[#DCE4F0] rounded-2xl p-6 md:p-10 shadow-xs">
//         <Suspense fallback={<div className="text-sm text-gray-500">Memuat data...</div>}>
//           <EditMateriContent />
//         </Suspense>
//       </div>

//       <footer className="text-center text-xs md:text-sm text-gray-500 pt-4">
//         @2026 | Aplikasi Rekap Materi Mengajar Dosen.
//       </footer>
//     </div>
//   );
// }


// dari no 1-250 codingan lama, sebelum diminta dosen untuk di revisi


"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Upload,
  FileText,
  Trash2,
  RefreshCw,
} from "lucide-react";

type MataKuliah = {
  id: string;
  nama: string;
};

type ExistingFile = {
  url: string;
  name: string;
  size?: string;
};

function formatInputDate(value: string) {
  if (!value) return "";

  const date = new Date(value);

  if (isNaN(date.getTime())) {
    return value.slice(0, 10);
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatFileSize(size: number) {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(0)} KB`;
  }

  return `${(size / (1024 * 1024)).toFixed(2)} MB`;
}

function EditMateriContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [matkuls, setMatkuls] = useState<MataKuliah[]>([]);

  const [form, setForm] = useState({
    id: "",
    mataKuliahId: "",
    tahunAjaran: "2026/2027",
    semester: "Ganjil",
    tanggal: "",
    pertemuan: "1",
    materi: "",
    tugas: "",
  });

  // File yang sudah tersimpan
  const [existingFile, setExistingFile] =
    useState<ExistingFile | null>(null);

  // File pengganti yang baru dipilih
  const [newFile, setNewFile] = useState<File | null>(null);

  const [removeExistingFile, setRemoveExistingFile] =
    useState(false);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mengambil data dari URL dan mata kuliah
  useEffect(() => {
    const qId = searchParams.get("id") || "";

    const qMatkulId =
      searchParams.get("matkulId") ||
      searchParams.get("mataKuliahId") ||
      "";

    const qTanggal = searchParams.get("tanggal") || "";
    const qPertemuan = searchParams.get("pertemuan") || "1";
    const qMateri = searchParams.get("materi") || "";
    const qTugas = searchParams.get("tugas") || "";

    const qTahun = searchParams.get("tahunAjaran") || "2026/2027";
    const qSemester = searchParams.get("semester") || "Ganjil";

    setForm({
      id: qId,
      mataKuliahId: qMatkulId,
      tahunAjaran: qTahun,
      semester: qSemester,
      tanggal: formatInputDate(qTanggal),
      pertemuan: qPertemuan,
      materi: qMateri,
      tugas: qTugas,
    });

    // Informasi file lama dari URL
    const fileUrl = searchParams.get("fileUrl") || "";
    const fileName = searchParams.get("fileName") || "";
    const fileSize = searchParams.get("fileSize") || "";

    if (fileUrl && fileName) {
      setExistingFile({
        url: fileUrl,
        name: fileName,
        size: fileSize,
      });
    }

    // Mengambil mata kuliah
    try {
      const stored = localStorage.getItem("user");
      const user = stored ? JSON.parse(stored) : null;

      const params = new URLSearchParams();

      if (user?.role === "DOSEN" && user?.email) {
        params.append("email", user.email);
      }

      params.append("role", user?.role || "DOSEN");

      fetch(`/api/matakuliah?${params.toString()}`)
        .then((r) => r.json())
        .then((j) => {
          if (j.success && Array.isArray(j.data)) {
            setMatkuls(j.data);
          }
        })
        .catch(() => {
          setError("Gagal mengambil data mata kuliah.");
        });
    } catch {
      setError("Gagal membaca data pengguna.");
    }
  }, [searchParams]);

  // Mengubah nilai input
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) setError(null);
  };

  // Memilih file pengganti
  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) return;

    const allowedExtensions = [
      "pdf",
      "doc",
      "docx",
      "ppt",
      "pptx",
    ];

    const extension = selectedFile.name
      .split(".")
      .pop()
      ?.toLowerCase();

    if (!extension || !allowedExtensions.includes(extension)) {
      setError("Format file harus PDF, DOC, DOCX, PPT, atau PPTX.");
      e.target.value = "";
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setError("Ukuran file maksimal 10 MB.");
      e.target.value = "";
      return;
    }

    setNewFile(selectedFile);
    setRemoveExistingFile(false);
    setError(null);
  };

  // Menghapus file lama atau file pengganti
  const handleRemoveFile = () => {
    if (newFile) {
      setNewFile(null);
    } else {
      setRemoveExistingFile(true);
      setExistingFile(null);
    }

    const input = document.getElementById(
      "fileMateri"
    ) as HTMLInputElement | null;

    if (input) input.value = "";
  };

  // Menyimpan perubahan
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();

      formData.append("id", form.id);
      formData.append("mataKuliahId", form.mataKuliahId);
      formData.append("tahunAjaran", form.tahunAjaran);
      formData.append("semester", form.semester);
      formData.append("tanggal", form.tanggal);
      formData.append("pertemuan", form.pertemuan);
      formData.append("materi", form.materi);
      formData.append("tugas", form.tugas);

      formData.append(
        "removeExistingFile",
        String(removeExistingFile)
      );

      if (newFile) {
        formData.append("fileMateri", newFile);
      }

      const res = await fetch("/api/materi", {
        method: "PUT",
        body: formData,
      });

      const j = await res.json();

      if (res.ok && j.success !== false) {
        setSuccess(true);

        setTimeout(() => {
          if (form.mataKuliahId) {
            router.push(
              `/dashboard/rekap/id?matkulId=${form.mataKuliahId}`
            );
          } else {
            router.push("/dashboard/rekap");
          }
        }, 1200);
      } else {
        setError(
          j.message || "Gagal memperbarui materi ajar."
        );
      }
    } catch {
      setError("Terjadi kesalahan koneksi.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-3 py-2 rounded-lg border border-[#CCD7ED] bg-white text-sm text-gray-700 outline-none focus:border-[#5469D4] focus:ring-1 focus:ring-[#5469D4]/30 transition";

  const labelClass =
    "text-sm font-semibold text-[#2D3748] md:pt-2";

  return (
    <form onSubmit={handleSubmit} className="space-y-3">

      {/* Notifikasi */}
      {success && (
        <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
          Materi ajar berhasil diperbarui. Mengalihkan...
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* MATA KULIAH */}
      <div className="grid grid-cols-1 md:grid-cols-[115px_minmax(0,1fr)] gap-2 md:gap-3 items-center">
        <label htmlFor="mataKuliahId" className={labelClass}>
          Mata Kuliah
        </label>

        <select
          id="mataKuliahId"
          name="mataKuliahId"
          required
          value={form.mataKuliahId}
          onChange={handleChange}
          className={inputClass}
        >
          <option value="">Pilih Mata Kuliah</option>

          {matkuls.map((m) => (
            <option key={m.id} value={m.id}>
              {m.nama}
            </option>
          ))}
        </select>
      </div>

      {/* TAHUN AJARAN */}
      <div className="grid grid-cols-1 md:grid-cols-[115px_minmax(0,1fr)] gap-2 md:gap-3 items-center">
        <label htmlFor="tahunAjaran" className={labelClass}>
          Tahun Ajaran
        </label>

        <select
          id="tahunAjaran"
          name="tahunAjaran"
          required
          value={form.tahunAjaran}
          onChange={handleChange}
          className={inputClass}
        >
          <option value="2025/2026">2025/2026</option>
          <option value="2026/2027">2026/2027</option>
          <option value="2027/2028">2027/2028</option>
          <option value="2028/2029">2028/2029</option>
        </select>
      </div>

      {/* SEMESTER */}
      <div className="grid grid-cols-1 md:grid-cols-[115px_minmax(0,1fr)] gap-2 md:gap-3 items-center">
        <label htmlFor="semester" className={labelClass}>
          Semester
        </label>

        <select
          id="semester"
          name="semester"
          required
          value={form.semester}
          onChange={handleChange}
          className={inputClass}
        >
          <option value="Ganjil">Ganjil</option>
          <option value="Genap">Genap</option>
        </select>
      </div>

      {/* TANGGAL */}
      <div className="grid grid-cols-1 md:grid-cols-[115px_minmax(0,1fr)] gap-2 md:gap-3 items-center">
        <label htmlFor="tanggal" className={labelClass}>
          Tanggal
        </label>

        <input
          id="tanggal"
          type="date"
          name="tanggal"
          required
          value={form.tanggal}
          onChange={handleChange}
          className={inputClass}
        />
      </div>

      {/* PERTEMUAN */}
      <div className="grid grid-cols-1 md:grid-cols-[115px_minmax(0,1fr)] gap-2 md:gap-3 items-center">
        <label htmlFor="pertemuan" className={labelClass}>
          Pertemuan ke-
        </label>

        <input
          id="pertemuan"
          type="number"
          min={1}
          name="pertemuan"
          required
          value={form.pertemuan}
          onChange={handleChange}
          className={inputClass}
        />
      </div>

      {/* MATERI */}
      <div className="grid grid-cols-1 md:grid-cols-[115px_minmax(0,1fr)] gap-2 md:gap-3 items-start">
        <label htmlFor="materi" className={labelClass}>
          Materi
        </label>

        <textarea
          id="materi"
          name="materi"
          required
          rows={2}
          value={form.materi}
          onChange={handleChange}
          placeholder="Tuliskan materi pembelajaran..."
          className={`${inputClass} resize-y min-h-13`}
        />
      </div>

      {/* TUGAS */}
      <div className="grid grid-cols-1 md:grid-cols-[115px_minmax(0,1fr)] gap-2 md:gap-3 items-center">
        <label htmlFor="tugas" className={labelClass}>
          Tugas
        </label>

        <input
          id="tugas"
          type="text"
          name="tugas"
          value={form.tugas}
          onChange={handleChange}
          placeholder="Penugasan (opsional)"
          className={inputClass}
        />
      </div>

      {/* UPLOAD MATERI */}
      <div className="grid grid-cols-1 md:grid-cols-[115px_minmax(0,1fr)] gap-2 md:gap-3 items-center">
        <label htmlFor="fileMateri" className={labelClass}>
          Upload Materi
        </label>

        <div className="w-full">

          {/* File lama atau file pengganti */}
          {(existingFile || newFile) && !removeExistingFile ? (
            <div className="flex items-center justify-between gap-2 border border-[#CCD7ED] bg-[#F8FAFF] rounded-lg px-3 py-2">

              <div className="flex items-center gap-2 min-w-0">
                <FileText
                  size={25}
                  className="text-red-500 shrink-0"
                />

                <div className="min-w-0">
                  <p className="text-xs font-semibold text-[#3155A4] truncate">
                    {newFile?.name || existingFile?.name}
                  </p>

                  <p className="text-[10px] text-gray-400">
                    {newFile
                      ? formatFileSize(newFile.size)
                      : existingFile?.size || ""}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">

                {/* Ganti File */}
                <label
                  htmlFor="fileMateri"
                  className="flex items-center gap-1 px-2 py-1.5 border border-[#DCE4F0] bg-white rounded-md text-[11px] text-gray-600 hover:bg-gray-100 cursor-pointer transition"
                >
                  <RefreshCw size={12} />
                  Ganti File
                </label>

                {/* Hapus File */}
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition"
                  title="Hapus file"
                  aria-label="Hapus file"
                >
                  <Trash2 size={18} />
                </button>

              </div>
            </div>
          ) : (
            <label
              htmlFor="fileMateri"
              className="flex items-center justify-between gap-2 w-full px-3 py-2.5 border border-[#CCD7ED] border-dashed rounded-lg bg-white hover:bg-[#F8FAFF] cursor-pointer transition"
            >
              <span className="text-xs text-gray-500">
                Klik untuk mengunggah (PDF, DOC, DOCX, PPT)
              </span>

              <Upload size={19} className="text-gray-600" />
            </label>
          )}

          <input
            id="fileMateri"
            type="file"
            accept=".pdf,.doc,.docx,.ppt,.pptx"
            onChange={handleFileChange}
            className="hidden"
          />

          <p className="text-[10px] text-gray-400 mt-1">
            Format PDF, DOC, DOCX, PPT, PPTX. Maksimal 10 MB.
          </p>
        </div>
      </div>

      {/* TOMBOL BATAL DAN UPDATE */}
      <div className="flex justify-between items-center gap-3 pt-2 md:pl-32">

        <button
          type="button"
          onClick={() => router.back()}
          disabled={loading}
          className="min-w-26.25 px-5 py-2 border border-[#CCD7ED] text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-semibold transition disabled:opacity-50"
        >
          ✕ Batal
        </button>

        <button
          type="submit"
          disabled={loading || success}
          className="min-w-31.25 px-5 py-2 bg-[#52C463] hover:bg-[#43ad53] text-white rounded-lg text-sm font-semibold transition shadow-sm disabled:opacity-50"
        >
          {loading ? "Memperbarui..." : "Update Materi"}
        </button>

      </div>
    </form>
  );
}

// HALAMAN UTAMA
export default function EditMateriPage() {
  const router = useRouter();

  return (
    <div className="w-full max-w-4xl mx-auto space-y-5">

      {/* HEADER */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="p-2 bg-white border border-[#DCE4F0] rounded-lg hover:bg-gray-50 text-gray-600 transition shadow-sm"
          aria-label="Kembali"
        >
          <ArrowLeft size={20} />
        </button>

        <h1 className="text-2xl md:text-3xl font-bold text-[#2D3748]">
          Edit Materi Ajar
        </h1>
      </div>

      {/* CARD FORM */}
      <div className="bg-white border border-[#DCE4F0] rounded-xl p-5 md:p-8 shadow-sm">

        <Suspense
          fallback={
            <div className="text-sm text-gray-500 text-center p-8">
              Memuat data...
            </div>
          }
        >
          <EditMateriContent />
        </Suspense>

      </div>

      {/* FOOTER */}
      <footer className="text-center text-xs md:text-sm text-gray-500 pt-1">
        @2026 | Aplikasi Rekap Materi Mengajar Dosen.
      </footer>

    </div>
  );
}
