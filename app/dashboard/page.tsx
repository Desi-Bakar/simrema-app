

export default function Dashboard() {
  const tahunMasehi = new Date().getFullYear();

  const materiTerbaru = [
    ["01/01/2026", "MikroTik", 3, "IP Address"],
    ["01/01/2026", "CISCO", 6, "Routing"],
    ["01/01/2026", "Linux Server", 9, "Perintah Dasar CLI"],
    ["01/01/2026", "Docker", 4, "Container"],
    ["01/01/2026", "Python", 6, "Library Kunci"],
  ];

  return (
    <div className="flex-1 p-6 bg-gray-100">

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 mb-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="bg-yellow-100 p-3 rounded-2xl text-xl">📄</div>
          <div>
            <p className="text-gray-500 text-sm">Total Materi</p>
            <h2 className="text-3xl font-bold">12</h2>
            <div className="mt-3 h-1 w-20 rounded-full bg-indigo-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="bg-green-100 p-3 rounded-2xl text-xl">📚</div>
          <div>
            <p className="text-gray-500 text-sm">Total Mata Kuliah</p>
            <h2 className="text-3xl font-bold">12</h2>
            <div className="mt-3 h-1 w-20 rounded-full bg-indigo-500" />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
          <div>
            <p className="text-lg font-semibold">Materi Terakhir</p>
            <p className="text-sm text-gray-500">Menampilkan 5 materi terakhir</p>
          </div>
          <button className="text-indigo-600 text-sm hover:underline">
            Lihat Semua Materi
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b border-gray-200">
                <th className="py-3">Tanggal</th>
                <th className="py-3">Mata Kuliah</th>
                <th className="py-3">Pertemuan</th>
                <th className="py-3">Materi</th>
              </tr>
            </thead>
            <tbody>
              {materiTerbaru.map((item, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-3 text-gray-700">{item[0]}</td>
                  <td className="text-gray-700">{item[1]}</td>
                  <td className="text-gray-700">{item[2]}</td>
                  <td className="text-indigo-600">{item[3]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          {tahunMasehi} | Aplikasi Rekap Materi Mengajar Dosen.
        </p>
      </div>
    </div>
  );
}
