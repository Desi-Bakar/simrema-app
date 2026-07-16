type Materi = [string, string, number, string];

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

export default MateriTable;