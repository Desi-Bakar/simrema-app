"use client";

import MateriTable from "../components/MateriTable";
import StatCard from "../components/StatCard";

type Materi = [string, string, number, string];

export default function Dashboard() {

  const materiTerbaru: Materi[] = [
    ["01/01/2026", "MikroTik", 3, "IP Address"],
    ["01/01/2026", "CISCO", 6, "Routing"],
    ["01/01/2026", "Linux Server", 9, "Perintah Dasar CLI"],
    ["01/01/2026", "Docker", 4, "Container"],
    ["01/01/2026", "Python", 6, "Library Kunci"],
  ];

  return (
    <div className="flex-1 bg-gray-100 w-full max-w-full overflow-x-hidden">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 w-92 gap-6 md:grid-cols-2 mb-6">
        <StatCard icon={"📄"} label="Total Materi" value={12} />
        <StatCard icon={"📚"} label="Total Mata Kuliah" value={12} />
      </div>

      {/* Materi Table */}
      <MateriTable materiTerbaru={materiTerbaru} />

    </div>
  );
}
