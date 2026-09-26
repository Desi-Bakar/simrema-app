import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { mataKuliah, tanggal, pertemuan, materi } = body;

    // Log data materi perkuliahan yang diterima
    console.log("Materi perkuliahan diterima:", {
      mataKuliah,
      tanggal,
      pertemuan,
      materi,
    });

    return NextResponse.json({
      message: "Berhasil disimpan",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}