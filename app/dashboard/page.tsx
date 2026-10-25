"use client";

import { useEffect, useState } from "react";
import StatCard from "../components/StatCard";
import MateriTable, { MateriItem } from "../components/MateriTable";

type RawMateri = {
  tanggal: string;
  pertemuan: number;
  materi: string;
  mataKuliah?: { nama: string };
};

export default function Dashboard() {
  const [totalMateri, setTotalMateri] = useState(0);
  const [totalMatkul, setTotalMatkul] = useState(0);
  const [materiTerbaru, setMateriTerbaru] = useState<MateriItem[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      const user = stored ? JSON.parse(stored) : null;
      const email = user?.email || "";
      const role = user?.role || "DOSEN";

      fetch(`/api/matakuliah?email=${encodeURIComponent(email)}&role=${role}`)
        .then((r) => r.json())
        .then((j) => {
          if (j.success && Array.isArray(j.data)) {
            setTotalMatkul(j.data.length);
          }
        });

      fetch(`/api/materi?email=${encodeURIComponent(email)}&role=${role}`)
        .then((r) => r.json())
        .then((j) => {
          if (j.success && Array.isArray(j.data)) {
            setTotalMateri(j.data.length);
            const latest: MateriItem[] = j.data.slice(0, 5).map((m: RawMateri) => ({
              tanggal: new Date(m.tanggal).toLocaleDateString("id-ID"),
              matkul: m.mataKuliah?.nama || "-",
              pertemuan: m.pertemuan,
              materi: m.materi,
            }));
            setMateriTerbaru(latest);
          }
        });
    } catch {
      // ignore
    }
  }, []);

  return (
    <div className="w-full space-y-8">
      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatCard type="materi" label="Total Materi" value={totalMateri} />
        <StatCard type="matakuliah" label="Total Mata Kuliah" value={totalMatkul} />
      </div>

      {/* Materi Terakhir Table */}
      <MateriTable materiTerbaru={materiTerbaru} />
    </div>
  );
}

