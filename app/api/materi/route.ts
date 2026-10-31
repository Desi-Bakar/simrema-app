import { NextResponse } from "next/server";
import { prisma } from "../../lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    const role = searchParams.get("role");
    const mataKuliahId = searchParams.get("mataKuliahId");

    const where: { mataKuliahId?: string; dosenEmail?: string } = {};
    if (mataKuliahId) where.mataKuliahId = mataKuliahId;
    if (role === "DOSEN" && email) where.dosenEmail = email;

    const data = await prisma.rekapMateri.findMany({
      where,
      include: {
        mataKuliah: { select: { id: true, nama: true, kode: true, dosenEmail: true } },
        dosen: { select: { email: true, profilDosen: { select: { nama: true } } } },
      },
      orderBy: [{ tanggal: "desc" }, { pertemuan: "desc" }],
    });

    return NextResponse.json({ success: true, data });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Terjadi kesalahan";
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { mataKuliahId, mataKuliah, tanggal, pertemuan, materi, tugas, dosenEmail } = body;

    let targetMatkulId = mataKuliahId;

    if (!targetMatkulId && mataKuliah) {
      const found = await prisma.mataKuliah.findFirst({
        where: { nama: { equals: String(mataKuliah).trim(), mode: "insensitive" } },
      });
      if (found) {
        targetMatkulId = found.id;
      } else if (dosenEmail) {
        const created = await prisma.mataKuliah.create({
          data: { nama: String(mataKuliah).trim(), dosenEmail },
        });
        targetMatkulId = created.id;
      }
    }

    if (!targetMatkulId) {
      return NextResponse.json({ message: "Mata kuliah wajib dipilih." }, { status: 400 });
    }

    const matkul = await prisma.mataKuliah.findUnique({ where: { id: targetMatkulId } });
    if (!matkul) {
      return NextResponse.json({ message: "Mata kuliah tidak ditemukan." }, { status: 404 });
    }

    const user = dosenEmail ? await prisma.user.findUnique({ where: { email: dosenEmail } }) : null;
    const assignedDosen = user ? user.email : matkul.dosenEmail;
    const nomor = Number(pertemuan) || 1;
    const tgl = tanggal ? new Date(tanggal) : new Date();

    const saved = await prisma.rekapMateri.upsert({
      where: {
        mataKuliahId_pertemuan: { mataKuliahId: targetMatkulId, pertemuan: nomor },
      },
      update: {
        tanggal: tgl,
        materi: String(materi || ""),
        tugas: tugas ? String(tugas) : null,
        dosenEmail: assignedDosen,
      },
      create: {
        mataKuliahId: targetMatkulId,
        pertemuan: nomor,
        tanggal: tgl,
        materi: String(materi || ""),
        tugas: tugas ? String(tugas) : null,
        dosenEmail: assignedDosen,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Materi perkuliahan berhasil disimpan.",
      data: saved,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Terjadi kesalahan";
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, mataKuliahId, pertemuan, tanggal, materi, tugas } = body;

    let updated;
    if (id) {
      updated = await prisma.rekapMateri.update({
        where: { id },
        data: {
          pertemuan: pertemuan ? Number(pertemuan) : undefined,
          tanggal: tanggal ? new Date(tanggal) : undefined,
          materi: materi !== undefined ? String(materi) : undefined,
          tugas: tugas !== undefined ? (tugas ? String(tugas) : null) : undefined,
        },
      });
    } else if (mataKuliahId && pertemuan) {
      updated = await prisma.rekapMateri.update({
        where: {
          mataKuliahId_pertemuan: { mataKuliahId, pertemuan: Number(pertemuan) },
        },
        data: {
          tanggal: tanggal ? new Date(tanggal) : undefined,
          materi: materi !== undefined ? String(materi) : undefined,
          tugas: tugas !== undefined ? (tugas ? String(tugas) : null) : undefined,
        },
      });
    } else {
      return NextResponse.json({ message: "Data tidak valid." }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: "Materi perkuliahan berhasil diperbarui.",
      data: updated,
    });
  } catch (error: unknown) {
    console.error("Error update materi:", error);
    if (error && typeof error === "object" && "code" in error && error.code === "P2002") {
      return NextResponse.json({ message: "Pertemuan ini sudah ada untuk mata kuliah tersebut." }, { status: 409 });
    }
    const message = error instanceof Error ? error.message : "Terjadi kesalahan";
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ message: "ID diperlukan." }, { status: 400 });

    await prisma.rekapMateri.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Berhasil dihapus." });
  } catch (error: unknown) {
    console.error("Error delete materi:", error);
    if (error && typeof error === "object" && "code" in error && error.code === "P2025") {
      return NextResponse.json({ message: "Rekap materi tidak ditemukan." }, { status: 404 });
    }
    const message = error instanceof Error ? error.message : "Terjadi kesalahan";
    return NextResponse.json({ message }, { status: 500 });
  }
}


