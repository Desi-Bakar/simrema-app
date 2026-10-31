"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, GraduationCap } from "lucide-react";
import MatkulTable, { Matkul } from "./MatkulTable";
import AddMatkulModal from "./AddMatkulModal";

export default function MataKuliahPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ email: string; role: string } | null>(null);
  const [list, setList] = useState<Matkul[]>([]);
  const [dosens, setDosens] = useState<Array<{ email: string; nama: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [, startTransition] = useTransition();

  const load = async (uEmail: string, uRole: string) => {
    try {
      const res = await fetch(`/api/matakuliah?email=${encodeURIComponent(uEmail)}&role=${uRole}`);
      const json = await res.json();
      if (json.success) setList(json.data);

      if (uRole === "ADMIN") {
        const uRes = await fetch("/api/users");
        const uJson = await uRes.json();
        if (uJson.success) {
          const dList = uJson.data.active.map((d: { email: string; profilDosen?: { nama: string } | null }) => ({
            email: d.email,
            nama: d.profilDosen?.nama || d.email,
          }));
          setDosens(dList);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    async function init() {
      try {
        const raw = localStorage.getItem("user");
        if (raw) {
          const u = JSON.parse(raw);
          if (u.role !== "ADMIN") {
            router.replace("/dashboard");
            return;
          }
          if (!ignore) setUser(u);
          await load(u.email || "", u.role);
        } else {
          router.replace("/login");
        }
      } catch {
        router.replace("/dashboard");
      }
    }
    init();
    return () => {
      ignore = true;
    };
  }, [router]);

  const handleDel = async (id: string, nama: string) => {
    if (!confirm(`Hapus mata kuliah "${nama}"?`)) return;
    const res = await fetch(`/api/matakuliah?id=${id}`, { method: "DELETE" });
    if (res.ok && user) startTransition(() => load(user.email, user.role));
  };

  const isAdmin = user?.role === "ADMIN";

  if (!loading && !isAdmin) {
    return (
      <div className="p-8 text-center text-sm text-gray-500">
        Halaman ini khusus Administrator.
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#2D3748]">Mata Kuliah</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {isAdmin ? "Kelola penugasan mata kuliah dosen" : "Mata kuliah yang ditugaskan kepada Anda"}
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setModal(true)}
            className="inline-flex items-center gap-2 bg-[#52C463] hover:bg-[#43ad53] text-white px-5 py-2.5 rounded-lg shadow-xs font-semibold text-sm transition"
          >
            <Plus size={18} />
            <span>Tambah Mata Kuliah</span>
          </button>
        )}
      </div>

      <div className="w-full bg-white border border-[#DCE4F0] rounded-2xl shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-sm text-gray-500">Memuat data...</div>
        ) : list.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <GraduationCap size={32} className="mx-auto text-gray-400" />
            <h3 className="text-base font-semibold text-gray-700">Belum Ada Mata Kuliah</h3>
            <p className="text-xs text-gray-500">
              {isAdmin ? "Klik Tambah Mata Kuliah untuk meng-assign dosen." : "Belum ada mata kuliah yang di-assign kepada Anda."}
            </p>
          </div>
        ) : (
          <MatkulTable list={list} isAdmin={isAdmin} onDelete={handleDel} />
        )}
      </div>

      {modal && (
        <AddMatkulModal
          dosens={dosens}
          onClose={() => setModal(false)}
          onSuccess={() => {
            setModal(false);
            if (user) startTransition(() => load(user.email, user.role));
          }}
        />
      )}
    </div>
  );
}
