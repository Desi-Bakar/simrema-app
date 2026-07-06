import { NextResponse } from "next/server";
import { supabase } from "../lib/supabase";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { mataKuliah, tanggal, pertemuan, materi } = body;

    const { error } = await supabase.from("materi_ajar").insert([
      {
        mata_kuliah: mataKuliah,
        tanggal,
        pertemuan,
        materi,
      },
    ]);

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

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