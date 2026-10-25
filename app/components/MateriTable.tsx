import Link from "next/link";

export type MateriItem = {
  tanggal: string;
  matkul: string;
  pertemuan: number;
  materi: string;
};

export default function MateriTable({
  materiTerbaru,
}: {
  materiTerbaru: MateriItem[];
}) {
  return (
    <div className="w-full">
      {/* Header Bagian */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-[#2D3748]">Materi Terakhir</h2>
          <p className="text-sm text-[#718096] mt-0.5">
            Menampilkan {materiTerbaru.length} materi terakhir
          </p>
        </div>
        <Link
          href="/dashboard/rekap"
          className="text-sm font-semibold text-[#7E8FE8] hover:text-[#5469D4] transition-colors"
        >
          Lihat Semua Materi
        </Link>
      </div>

      {/* Tabel Card */}
      <div className="w-full bg-white border border-[#DCE4F0] rounded-2xl shadow-xs overflow-hidden">
        {materiTerbaru.length === 0 ? (
          <div className="p-10 text-center space-y-1">
            <p className="text-sm font-semibold text-gray-700">Belum Ada Rekap Materi</p>
            <p className="text-xs text-gray-500">Catatan materi perkuliahan belum ditambahkan.</p>
          </div>
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FAFBFD] border-b border-[#EDF2F7] text-[#2D3748] text-sm font-bold">
                  <th className="py-4 px-6 border-r border-[#EDF2F7] whitespace-nowrap">
                    Tanggal
                  </th>
                  <th className="py-4 px-6 border-r border-[#EDF2F7] whitespace-nowrap">
                    Mata Kuliah
                  </th>
                  <th className="py-4 px-6 border-r border-[#EDF2F7] whitespace-nowrap">
                    Pertemuan
                  </th>
                  <th className="py-4 px-6 whitespace-nowrap">Materi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EDF2F7]">
                {materiTerbaru.map((item, index) => (
                  <tr
                    key={index}
                    className="hover:bg-[#F8FAFC] transition-colors text-sm text-[#4A5568]"
                  >
                    <td className="py-4 px-6 border-r border-[#EDF2F7] whitespace-nowrap">
                      {item.tanggal}
                    </td>
                    <td className="py-4 px-6 border-r border-[#EDF2F7] whitespace-nowrap">
                      {item.matkul}
                    </td>
                    <td className="py-4 px-6 border-r border-[#EDF2F7] whitespace-nowrap">
                      {item.pertemuan}
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">{item.materi}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}