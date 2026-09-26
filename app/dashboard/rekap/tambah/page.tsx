"use client";

import Link from "next/link";
import RekapMateriForm from "../Form";
import { ArrowLeft } from "lucide-react";

export default function TambahMateriPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard/rekap"
          className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 transition"
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Form Rekap Materi Baru</h1>
          <p className="text-gray-500 text-sm">Tambahkan catatan pertemuan dan materi ajar yang telah disampaikan.</p>
        </div>
      </div>

      <RekapMateriForm />
    </div>
  );
}
