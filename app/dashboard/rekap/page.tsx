"use client";

import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";
import { useState } from "react";

type Materi = {
  tanggal: string;
  mataKuliah: string;
  pertemuan: number;
  materi: string;
};

const data: Materi[] = [
  { tanggal: "01/01/2026", mataKuliah: "MikroTik", pertemuan: 3, materi: "IP Address" },
  { tanggal: "01/01/2026", mataKuliah: "CISCO", pertemuan: 6, materi: "Routing" },
  { tanggal: "01/01/2026", mataKuliah: "Linux Server", pertemuan: 9, materi: "Perintah Dasar CLI" },
  { tanggal: "01/01/2026", mataKuliah: "Docker", pertemuan: 4, materi: "Container" },
  { tanggal: "01/01/2026", mataKuliah: "Python", pertemuan: 6, materi: "Library Kunci" },
];

const columns: ColumnDef<Materi>[] = [
  { header: "Tanggal", accessorKey: "tanggal" },
  { header: "Mata Kuliah", accessorKey: "mataKuliah" },
  { header: "Pertemuan", accessorKey: "pertemuan" },
  { header: "Materi", accessorKey: "materi" },
  {
    header: "Aksi",
    cell: () => (
      <button className="px-3 py-1 text-sm font-medium text-white bg-blue-500 rounded hover:bg-blue-600 transition">
        Lihat
      </button>
    ),
  },
];

export default function RekapTable() {
  const [page, setPage] = useState(1);
  const pageSize = 4;
  const paginatedData = data.slice((page - 1) * pageSize, page * pageSize);

  const table = useReactTable({
    data: paginatedData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="w-92 md:w-full max-w-full mx-auto bg-white shadow-lg rounded-xl p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-3">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800">Rekap Mata Kuliah</h2>
        <button className="bg-green-500 text-white px-4 py-2 rounded-lg shadow hover:bg-green-600 transition">
          + Tambah Materi
        </button>
      </div>

      {/* Responsive Scrollable Table */}
      <div className="overflow-x-auto w-full">
        <table className="min-w-max w-full text-sm text-left text-gray-700">
          <thead className="bg-gray-50 text-gray-900">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 md:px-6 py-3 font-semibold whitespace-nowrap"
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-100 transition-colors">
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="px-4 md:px-6 py-3 border-t whitespace-nowrap"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mt-4 gap-3">
        <span className="text-gray-600 text-sm">
          Menampilkan {(page - 1) * pageSize + 1} hingga{" "}
          {Math.min(page * pageSize, data.length)} dari {data.length} data
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="px-3 md:px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-200 disabled:opacity-50"
          >
            Prev
          </button>
          <button
            onClick={() => setPage((p) => Math.min(p + 1, Math.ceil(data.length / pageSize)))}
            disabled={page === Math.ceil(data.length / pageSize)}
            className="px-3 md:px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-200 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
