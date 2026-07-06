"use client";

type Materi = [string, string, number, string];

const StatCard = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm flex items-center gap-4">
    <div className="bg-gray-100 p-3 rounded-2xl text-xl">{icon}</div>
    <div>
      <p className="text-gray-500 text-sm">{label}</p>
      <h2 className="text-3xl font-bold">{value}</h2>
      <div className="mt-3 h-1 w-20 rounded-full bg-indigo-500" />
    </div>
  </div>
);

const MateriTable = ({ materiTerbaru }: { materiTerbaru: Materi[] }) => (
  <div className="bg-white overflow-x-auto w-92 md:w-full p-6 rounded-2xl shadow-sm">
    {/* Header */}
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
      <div>
        <p className="text-lg font-semibold">Materi Terakhir</p>
        <p className="text-sm text-gray-500">Menampilkan 5 materi terakhir</p>
      </div>
      <button className="text-indigo-600 text-sm hover:underline">
        Lihat Semua Materi
      </button>
    </div>

    {/* Scrollable Table */}
    <div className="overflow-x-auto w-full">
      <table className="min-w-max w-full text-sm">
        <thead>
          <tr className="text-left text-gray-500 border-b border-gray-200">
            <th className="py-3 px-4 whitespace-nowrap">Tanggal</th>
            <th className="py-3 px-4 whitespace-nowrap">Mata Kuliah</th>
            <th className="py-3 px-4 whitespace-nowrap">Pertemuan</th>
            <th className="py-3 px-4 whitespace-nowrap">Materi</th>
          </tr>
        </thead>
        <tbody>
          {materiTerbaru.map((item, index) => (
            <tr
              key={index}
              className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <td className="py-3 px-4 text-gray-700 whitespace-nowrap">
                {item[0]}
              </td>
              <td className="px-4 text-gray-700 whitespace-nowrap">{item[1]}</td>
              <td className="px-4 text-gray-700 whitespace-nowrap">{item[2]}</td>
              <td className="px-4 text-indigo-600 whitespace-nowrap">{item[3]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default function Dashboard() {
  const tahunMasehi = new Date().getFullYear();

  const materiTerbaru: Materi[] = [
    ["01/01/2026", "MikroTik", 3, "IP Address"],
    ["01/01/2026", "CISCO", 6, "Routing"],
    ["01/01/2026", "Linux Server", 9, "Perintah Dasar CLI"],
    ["01/01/2026", "Docker", 4, "Container"],
    ["01/01/2026", "Python", 6, "Library Kunci"],
  ];

  return (
    <div className="flex-1 p-4 md:p-6 bg-gray-100 w-full max-w-full overflow-x-hidden">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 mb-6">
        <StatCard icon={"📄"} label="Total Materi" value={12} />
        <StatCard icon={"📚"} label="Total Mata Kuliah" value={12} />
      </div>

      {/* Materi Table */}
      <MateriTable materiTerbaru={materiTerbaru} />

      {/* Footer */}
      <p className="text-center text-xs text-gray-400 mt-6">
        {tahunMasehi} | Aplikasi Rekap Materi Mengajar Dosen.
      </p>
    </div>
  );
}
