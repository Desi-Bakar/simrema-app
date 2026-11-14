// "use client";

// import { useEffect, useState } from "react";
// import { useRouter, useSearchParams } from "next/navigation";

// export default function RekapMateriForm({ onSuccess, onCancel }: { onSuccess?: () => void; onCancel?: () => void }) {
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   const [matkuls, setMatkuls] = useState<Array<{ id: string; nama: string }>>([]);
//   const [userEmail, setUserEmail] = useState("");
//   const [form, setForm] = useState({
//     mataKuliahId: "",
//     mataKuliah: "",
//     tanggal: new Date().toISOString().split("T")[0],
//     pertemuan: "1",
//     materi: "",
//     tugas: "",
//   });

//   const [loading, setLoading] = useState(false);
//   const [success, setSuccess] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     try {
//       const stored = localStorage.getItem("user");
//       const u = stored ? JSON.parse(stored) : null;
//       if (u) {
//         setUserEmail(u.email || "");
//         // Admin: fetch semua. Dosen: fetch hanya punya dia
//         const params = new URLSearchParams();
//         if (u.role === "DOSEN" && u.email) {
//           params.append("email", u.email);
//         }
//         params.append("role", u.role || "DOSEN");
        
//         fetch(`/api/matakuliah?${params.toString()}`)
//           .then((r) => r.json())
//           .then((j) => {
//             if (j.success && Array.isArray(j.data)) {
//               setMatkuls(j.data);
//               const qId = searchParams.get("matkulId");
//               const qNama = searchParams.get("matkulNama");
//               if (qId) {
//                 setForm((p) => ({ ...p, mataKuliahId: qId, mataKuliah: qNama || "" }));
//               } else if (j.data.length > 0) {
//                 setForm((p) => ({ ...p, mataKuliahId: j.data[0].id, mataKuliah: j.data[0].nama }));
//               }
//             }
//           });
//       }
//     } catch {
//       // ignore
//     }
//   }, [searchParams]);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     if (name === "mataKuliahId") {
//       const sel = matkuls.find((m) => m.id === value);
//       setForm((p) => ({ ...p, mataKuliahId: value, mataKuliah: sel?.nama || "" }));
//     } else {
//       setForm((p) => ({ ...p, [name]: value }));
//     }
//     if (error) setError(null);
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);

//     try {
//       const res = await fetch("/api/materi", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ ...form, dosenEmail: userEmail }),
//       });
//       if (res.ok) {
//         setSuccess(true);
//         setTimeout(() => {
//           if (onSuccess) onSuccess();
//           else router.push("/dashboard/rekap");
//         }, 1200);
//       } else {
//         const j = await res.json();
//         setError(j.message || "Gagal menyimpan.");
//       }
//     } catch {
//       setError("Kesalahan koneksi.");
//     } finally {
//       setLoading(false);
//     }
//   };


//   return (
//     <form onSubmit={handleSubmit} className="space-y-5">
//       {success && (
//         <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
//           Materi ajar berhasil disimpan. Mengalihkan ke rekap...
//         </div>
//       )}

//       {error && (
//         <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
//           {error}
//         </div>
//       )}

//       <div>
//         <label htmlFor="mataKuliahId" className="block text-sm font-bold text-[#2D3748] mb-2">
//           Mata Kuliah
//         </label>
//         {matkuls.length > 0 ? (
//           <select
//             id="mataKuliahId"
//             name="mataKuliahId"
//             required
//             value={form.mataKuliahId}
//             onChange={handleChange}
//             className="w-full px-4 py-2.5 rounded-lg border border-[#CCD7ED] bg-white text-sm text-gray-800"
//           >
//             {matkuls.map((m) => (
//               <option key={m.id} value={m.id}>
//                 {m.nama}
//               </option>
//             ))}
//           </select>
//         ) : (
//           <input
//             id="mataKuliah"
//             type="text"
//             name="mataKuliah"
//             required
//             value={form.mataKuliah}
//             onChange={handleChange}
//             placeholder="Mata Kuliah"
//             className="w-full px-4 py-2.5 rounded-lg border border-[#CCD7ED] bg-white text-sm text-gray-800"
//           />
//         )}
//       </div>

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
//           className="w-full px-4 py-2.5 rounded-lg border border-[#CCD7ED] bg-white text-sm text-gray-800"
//         />
//       </div>

//       <div>
//         <label htmlFor="pertemuan" className="block text-sm font-bold text-[#2D3748] mb-2">
//           Pertemuan
//         </label>
//         <input
//           id="pertemuan"
//           type="number"
//           name="pertemuan"
//           required
//           min={1}
//           value={form.pertemuan}
//           onChange={handleChange}
//           placeholder="1"
//           className="w-full px-4 py-2.5 rounded-lg border border-[#CCD7ED] bg-white text-sm text-gray-800"
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
//           placeholder="Materi ...."
//           className="w-full px-4 py-2.5 rounded-lg border border-[#CCD7ED] bg-white text-sm text-gray-800 resize-y"
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
//           placeholder="Tugas"
//           className="w-full px-4 py-2.5 rounded-lg border border-[#CCD7ED] bg-white text-sm text-gray-800"
//         />
//       </div>

//       <div className="flex justify-end items-center gap-3 pt-4">
//         <button
//           type="submit"
//           disabled={loading}
//           className="px-8 py-2.5 bg-[#52C463] hover:bg-[#43ad53] text-white rounded-lg text-sm font-semibold transition shadow-xs disabled:opacity-50"
//         >
//           {loading ? "Menyimpan..." : "Simpan"}
//         </button>
//         <button
//           type="button"
//           onClick={() => (onCancel ? onCancel() : router.push("/dashboard/rekap"))}
//           className="px-8 py-2.5 border border-[#CCD7ED] text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-semibold transition"
//         >
//           Batal
//         </button>
//       </div>
//     </form>
//   );
// }

// dari 1-228 ini codingan yang lama, sebelum direvisi


"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Upload, FileText, X } from "lucide-react";

type MataKuliah = {
  id: string;
  nama: string;
};

export default function RekapMateriForm({
  onSuccess,
  onCancel,
}: {
  onSuccess?: () => void;
  onCancel?: () => void;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [matkuls, setMatkuls] = useState<MataKuliah[]>([]);
  const [userEmail, setUserEmail] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const [form, setForm] = useState({
    mataKuliahId: "",
    mataKuliah: "",
    tahunAjaran: "2026/2027",
    semester: "Ganjil",
    tanggal: new Date().toLocaleDateString("en-CA"),
    pertemuan: "1",
    materi: "",
    tugas: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mengambil data mata kuliah dari API
  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      const u = stored ? JSON.parse(stored) : null;

      if (u) {
        setUserEmail(u.email || "");

        const params = new URLSearchParams();

        if (u.role === "DOSEN" && u.email) {
          params.append("email", u.email);
        }

        params.append("role", u.role || "DOSEN");

        fetch(`/api/matakuliah?${params.toString()}`)
          .then((r) => r.json())
          .then((j) => {
            if (j.success && Array.isArray(j.data)) {
              setMatkuls(j.data);

              const qId = searchParams.get("matkulId");
              const qNama = searchParams.get("matkulNama");

              if (qId) {
                setForm((p) => ({
                  ...p,
                  mataKuliahId: qId,
                  mataKuliah: qNama || "",
                }));
              } else if (j.data.length > 0) {
                setForm((p) => ({
                  ...p,
                  mataKuliahId: j.data[0].id,
                  mataKuliah: j.data[0].nama,
                }));
              }
            }
          })
          .catch(() => {
            setError("Gagal mengambil data mata kuliah.");
          });
      }
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

    if (name === "mataKuliahId") {
      const selected = matkuls.find((m) => m.id === value);

      setForm((p) => ({
        ...p,
        mataKuliahId: value,
        mataKuliah: selected?.nama || "",
      }));
    } else {
      setForm((p) => ({
        ...p,
        [name]: value,
      }));
    }

    if (error) setError(null);
  };

  // Memilih file materi
  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) return;

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    ];

    if (!allowedTypes.includes(selectedFile.type)) {
      setError("Format file harus PDF, DOC, DOCX, PPT, atau PPTX.");
      e.target.value = "";
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setError("Ukuran file maksimal 10 MB.");
      e.target.value = "";
      return;
    }

    setFile(selectedFile);
    setError(null);
  };

  // Menghapus file yang sudah dipilih
  const removeFile = () => {
    setFile(null);

    const input = document.getElementById(
      "fileMateri"
    ) as HTMLInputElement | null;

    if (input) input.value = "";
  };

  // Menyimpan data materi
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();

      formData.append("mataKuliahId", form.mataKuliahId);
      formData.append("mataKuliah", form.mataKuliah);
      formData.append("tahunAjaran", form.tahunAjaran);
      formData.append("semester", form.semester);
      formData.append("tanggal", form.tanggal);
      formData.append("pertemuan", form.pertemuan);
      formData.append("materi", form.materi);
      formData.append("tugas", form.tugas);
      formData.append("dosenEmail", userEmail);

      if (file) {
        formData.append("file", file);
      }

      const res = await fetch("/api/materi", {
        method: "POST",
        body: formData,
      });

      const j = await res.json();

      if (res.ok && j.success !== false) {
        setSuccess(true);

        setTimeout(() => {
          if (onSuccess) {
            onSuccess();
          } else {
            router.push("/dashboard/rekap");
          }
        }, 1200);
      } else {
        setError(j.message || "Gagal menyimpan materi.");
      }
    } catch {
      setError("Terjadi kesalahan koneksi.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-3 py-2 rounded-lg border border-[#CCD7ED] bg-white text-sm text-gray-700 outline-none focus:border-[#5068DE] focus:ring-1 focus:ring-[#5068DE] transition";

  const labelClass =
    "text-sm font-semibold text-[#2D3748] md:pt-2";

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full space-y-3"
    >
      {/* Notifikasi berhasil */}
      {success && (
        <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
          Materi ajar berhasil disimpan. Mengalihkan ke rekap...
        </div>
      )}

      {/* Notifikasi error */}
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
          <option value="" disabled>
            Pilih Mata Kuliah
          </option>

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
          name="pertemuan"
          required
          min={1}
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
          placeholder="Materi ...."
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
          placeholder="Tugas"
          className={inputClass}
        />
      </div>

      {/* UPLOAD MATERI */}
      <div className="grid grid-cols-1 md:grid-cols-[115px_minmax(0,1fr)] gap-2 md:gap-3 items-center">
        <label htmlFor="fileMateri" className={labelClass}>
          Upload Materi
        </label>

        <div className="w-full">
          <label
            htmlFor="fileMateri"
            className="flex items-center justify-between gap-2 w-full px-3 py-2.5 border border-[#CCD7ED] rounded-lg bg-white hover:bg-[#F8FAFF] cursor-pointer transition"
          >
            <span className="text-xs text-gray-500 truncate">
              {file
                ? file.name
                : "Klik untuk mengunggah (PDF, DOC, DOCX, PPT)"}
            </span>

            <Upload
              size={20}
              className="text-gray-600 shrink-0"
            />
          </label>

          <input
            id="fileMateri"
            type="file"
            accept=".pdf,.doc,.docx,.ppt,.pptx"
            onChange={handleFileChange}
            className="hidden"
          />

          {file && (
            <div className="flex items-center justify-between mt-2 p-2 bg-[#F0F3FF] rounded-lg">
              <div className="flex items-center gap-2 min-w-0">
                <FileText
                  size={17}
                  className="text-red-500 shrink-0"
                />
                <span className="text-xs text-gray-600 truncate">
                  {file.name}
                </span>
              </div>

              <button
                type="button"
                onClick={removeFile}
                className="text-red-500 hover:text-red-700"
                aria-label="Hapus file"
              >
                <X size={17} />
              </button>
            </div>
          )}

          <p className="text-[10px] text-gray-400 mt-1">
            Maksimal 10 MB.
          </p>
        </div>
      </div>

      {/* TOMBOL SIMPAN DAN BATAL */}
      <div className="flex justify-end items-center gap-3 pt-2 md:pl-32">

        <button
          type="submit"
          disabled={loading || success}
          className="min-w-25.5 px-5 py-2 bg-[#52C463] hover:bg-[#43ad53] text-white rounded-lg text-sm font-semibold transition disabled:opacity-50"
        >
          {loading ? "Menyimpan..." : "Simpan"}
        </button>

        <button
          type="button"
          onClick={() =>
            onCancel
              ? onCancel()
              : router.push("/dashboard/rekap")
          }
          className="min-w-25.5 px-5 py-2 border border-[#CCD7ED] text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-semibold transition"
        >
          Batal
        </button>

      </div>
    </form>
  );
}
