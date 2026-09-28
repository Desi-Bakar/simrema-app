"use client";

import StatCard from "../components/StatCard";
import MateriTable, { MateriItem } from "../components/MateriTable";

const materiTerbaru: MateriItem[] = [
  { tanggal: "01/01/2026", matkul: "MikroTik", pertemuan: 3, materi: "IP Address" },
  { tanggal: "01/01/2026", matkul: "CISCO", pertemuan: 6, materi: "Routing" },
  { tanggal: "01/01/2026", matkul: "Linux Server", pertemuan: 9, materi: "Perintah Dasar CLI" },
  { tanggal: "01/01/2026", matkul: "Docker", pertemuan: 4, materi: "Container" },
  { tanggal: "01/01/2026", matkul: "Python", pertemuan: 6, materi: "Library Kunci" },
];

export default function Dashboard() {
  return (
    <div className="w-full space-y-8">
      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatCard type="materi" label="Total Materi" value={12} />
        <StatCard type="matakuliah" label="Total Mata Kuliah" value={12} />
      </div>

      {/* Materi Terakhir Table */}
      <MateriTable materiTerbaru={materiTerbaru} />
    </div>
  );
}
