"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { UserCheck, UserX, Clock, Users as UsersIcon, ShieldCheck, Check, X } from "lucide-react";

type UserItem = {
  email: string;
  role: "DOSEN" | "ADMIN";
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
  profilDosen?: {
    nama: string;
    telepon?: string;
  } | null;
};

export default function UsersManagementPage() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{
    pending: UserItem[];
    active: UserItem[];
    all: UserItem[];
    counts: { total: number; pending: number; active: number; rejected: number };
  }>({
    pending: [],
    active: [],
    all: [],
    counts: { total: 0, pending: 0, active: 0, rejected: 0 },
  });

  const [activeTab, setActiveTab] = useState<"pending" | "all">("pending");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users");
      const json = await res.json();
      if (json.success) {
        setData(json.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    try {
      const raw = localStorage.getItem("user");
      const u = raw ? JSON.parse(raw) : null;
      if (u?.role !== "ADMIN") {
        router.replace("/dashboard");
        return;
      }
      setIsAdmin(true);
      fetchUsers();
    } catch {
      router.replace("/dashboard");
    }
  }, [router]);

  if (!loading && !isAdmin) {
    return (
      <div className="p-8 text-center text-sm text-gray-500">
        Halaman ini khusus Administrator.
      </div>
    );
  }

  const handleApprove = async (email: string) => {
    if (!confirm(`Setujui (ACC) permohonan akses untuk ${email}? Akun akan diberikan password awal "dosen123".`)) return;

    setActionLoading(email);
    try {
      const res = await fetch("/api/users/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const resJson = await res.json();
      if (res.ok) {
        setToast({ message: resJson.message, type: "success" });
        await fetchUsers();
      } else {
        setToast({ message: resJson.message || "Gagal menyetujui user", type: "error" });
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Terjadi kesalahan";
      setToast({ message, type: "error" });
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (email: string) => {
    if (!confirm(`Apakah Anda yakin ingin menolak permohonan akses untuk ${email}?`)) return;

    setActionLoading(email);
    try {
      const res = await fetch("/api/users/reject", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const resJson = await res.json();
      if (res.ok) {
        setToast({ message: resJson.message, type: "success" });
        await fetchUsers();
      } else {
        setToast({ message: resJson.message || "Gagal menolak user", type: "error" });
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Terjadi kesalahan";
      setToast({ message, type: "error" });
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Judul & Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Manajemen Pengguna & Request Akses</h1>
          <p className="text-gray-500 mt-1">
            Kelola persetujuan akses dosen dan daftar pengguna sistem SIMREMA.
          </p>
        </div>
        <button
          onClick={fetchUsers}
          className="px-4 py-2 border bg-white hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium shadow-sm transition"
        >
          Muat Ulang Data
        </button>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div
          className={`p-4 rounded-lg text-sm flex justify-between items-center ${
            toast.type === "success"
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          <span>{toast.message}</span>
          <button
            onClick={() => setToast(null)}
            className="text-gray-500 hover:text-gray-800 ml-4 p-1"
            aria-label="Tutup notifikasi"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Menunggu ACC</p>
            <p className="text-2xl font-bold text-gray-800">{data.counts.pending}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-green-50 text-green-600 rounded-lg">
            <UserCheck size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Akun Aktif</p>
            <p className="text-2xl font-bold text-gray-800">{data.counts.active}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-red-50 text-red-600 rounded-lg">
            <UserX size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Ditolak</p>
            <p className="text-2xl font-bold text-gray-800">{data.counts.rejected}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
            <UsersIcon size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Akun</p>
            <p className="text-2xl font-bold text-gray-800">{data.counts.total}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab("pending")}
          className={`py-3 px-6 text-sm font-semibold border-b-2 transition flex items-center gap-2 ${
            activeTab === "pending"
              ? "border-amber-500 text-amber-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          <Clock size={16} />
          Menunggu Persetujuan ({data.counts.pending})
        </button>
        <button
          onClick={() => setActiveTab("all")}
          className={`py-3 px-6 text-sm font-semibold border-b-2 transition flex items-center gap-2 ${
            activeTab === "all"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          <UsersIcon size={16} />
          Semua Pengguna ({data.counts.total})
        </button>
      </div>

      {/* Tab Content */}
      {loading ? (
        <div className="bg-white p-12 rounded-xl text-center text-gray-500">
          Memuat data pengguna...
        </div>
      ) : activeTab === "pending" ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {data.pending.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <UserCheck className="mx-auto text-green-500 mb-3" size={40} />
              <p className="text-lg font-medium text-gray-700">Tidak ada permohonan akses baru</p>
              <p className="text-sm text-gray-400 mt-1">
                Semua pendaftar telah diverifikasi atau belum ada yang mendaftar.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-700">
                <thead className="bg-gray-50 text-gray-900 border-b">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Nama Lengkap</th>
                    <th className="px-6 py-4 font-semibold">Email</th>
                    <th className="px-6 py-4 font-semibold">No. Telepon / WA</th>
                    <th className="px-6 py-4 font-semibold">Waktu Daftar</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {data.pending.map((user) => (
                    <tr key={user.email} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {user.profilDosen?.nama || "-"}
                      </td>
                      <td className="px-6 py-4">{user.email}</td>
                      <td className="px-6 py-4 font-medium text-gray-700">
                        {user.profilDosen?.telepon || "-"}
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">
                          PENDING
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleApprove(user.email)}
                            disabled={actionLoading === user.email}
                            className="bg-green-600 hover:bg-green-700 text-white px-3.5 py-1.5 rounded-lg font-medium text-xs shadow-sm transition disabled:opacity-50 inline-flex items-center gap-1.5"
                          >
                            <Check size={14} />
                            <span>{actionLoading === user.email ? "Memproses..." : "Setujui"}</span>
                          </button>
                          <button
                            onClick={() => handleReject(user.email)}
                            disabled={actionLoading === user.email}
                            className="bg-red-500 hover:bg-red-600 text-white px-3.5 py-1.5 rounded-lg font-medium text-xs shadow-sm transition disabled:opacity-50 inline-flex items-center gap-1.5"
                          >
                            <X size={14} />
                            <span>Tolak</span>
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
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-700">
              <thead className="bg-gray-50 text-gray-900 border-b">
                <tr>
                  <th className="px-6 py-4 font-semibold">Nama</th>
                  <th className="px-6 py-4 font-semibold">Email</th>
                  <th className="px-6 py-4 font-semibold">Role</th>
                  <th className="px-6 py-4 font-semibold">Status Akun</th>
                  <th className="px-6 py-4 font-semibold">Terdaftar</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {data.all.map((user) => (
                  <tr key={user.email} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {user.profilDosen?.nama || (user.role === "ADMIN" ? "Administrator" : "-")}
                    </td>
                    <td className="px-6 py-4">{user.email}</td>
                    <td className="px-6 py-4">
                      {user.role === "ADMIN" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">
                          <ShieldCheck size={12} /> ADMIN
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                          DOSEN
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          user.status === "APPROVED"
                            ? "bg-green-100 text-green-700"
                            : user.status === "PENDING"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString("id-ID")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
