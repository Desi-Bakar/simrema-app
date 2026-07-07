"use client";

import Link from "next/link";

export default function DetailRekap() {

const data=[
{
pertemuan:1,
tanggal:"01/01/2026",
materi:"IP Address",
tugas:"IP Address"
},
{
pertemuan:2,
tanggal:"01/01/2026",
materi:"Routing",
tugas:"Routing"
},
{
pertemuan:3,
tanggal:"01/01/2026",
materi:"IP Static",
tugas:"IP Static"
},
{
pertemuan:4,
tanggal:"01/01/2026",
materi:"IP Dinamic",
tugas:"IP Dinamic"
},
{
pertemuan:5,
tanggal:"01/01/2026",
materi:"OSI Layer",
tugas:"OSI Layer"
},
]

return(

<div className="p-8">

<h1 className="text-4xl font-bold mb-8">
Rekap Materi Ajar : MikroTik
</h1>

<div className="mb-6">

<Link
href="/dashboard/rekap"
className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold"
>
+ Tambah Materi
</Link>

</div>

<div className="bg-white rounded-xl shadow border overflow-hidden">

<table className="w-full">

<thead className="bg-gray-100">

<tr>

<th className="py-3">Pertemuan</th>

<th>Tanggal</th>

<th>Materi</th>

<th>Tugas</th>

<th>Aksi</th>

</tr>

</thead>

<tbody>

{data.map((item,index)=>(

<tr
key={index}
className="border-t text-center"
>

<td className="py-4">{item.pertemuan}</td>

<td>{item.tanggal}</td>

<td>{item.materi}</td>

<td>{item.tugas}</td>

<td>

<button className="bg-indigo-600 text-white px-5 py-2 rounded-lg">

Edit

</button>

</td>

</tr>

))}

</tbody>

</table>

</div>

<div className="flex justify-end mt-8">

<button className="border border-indigo-300 px-8 py-3 rounded-lg">

Bagikan

</button>

</div>

</div>

)

}