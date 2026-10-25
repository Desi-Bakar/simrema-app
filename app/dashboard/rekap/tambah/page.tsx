import { Suspense } from "react";
import Link from "next/link";
import RekapMateriForm from "../Form";
import { ArrowLeft } from "lucide-react";

export default function TambahMateriPage() {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard/rekap"
          className="p-2 bg-white border border-[#DCE4F0] rounded-lg hover:bg-gray-50 text-gray-600 transition shadow-xs"
          aria-label="Kembali"
        >
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl md:text-3xl font-bold text-[#2D3748]">
          Input Materi Ajar
        </h1>
      </div>

      {/* Cardbox */}
      <div className="bg-white border border-[#DCE4F0] rounded-2xl p-6 md:p-10 shadow-xs">
        <Suspense fallback={<div className="text-sm text-gray-500">Memuat formulir...</div>}>
          <RekapMateriForm />
        </Suspense>
      </div>

      {/* Footer */}
      <footer className="text-center text-xs md:text-sm text-gray-500 pt-4">
        @2026 | Aplikasi Rekap Materi Mengajar Dosen.
      </footer>
    </div>
  );
}


