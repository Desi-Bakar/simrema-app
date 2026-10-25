import { NextResponse } from "next/server";
import { prisma } from "../../lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    const role = searchParams.get("role");

    // Jika DOSEN, hanya muncul mata kuliah yang di-assign ke dia
    // Jika ADMIN, muncul semua mata kuliah
    const whereClause =
      role === "DOSEN" && email
        ? { dosenEmail: email }
        : {};

    const mataKuliah = await prisma.mataKuliah.findMany({
      where: whereClause,
      include: {
        dosen: {
          select: {
            email: true,
            profilDosen: {
              select: {
                nama: true,
              },
            },
          },
        },
        _count: {
          select: {
            rekapMateri: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      data: mataKuliah,
    });
  } catch (error: unknown) {
    console.error("Error get mata kuliah:", error);
    const message = error instanceof Error ? error.message : "Terjadi kesalahan";
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nama, kode, sks, semester, dosenEmail } = body;

    if (!nama || !dosenEmail) {
      return NextResponse.json(
        { message: "Nama mata kuliah dan Dosen pengampu wajib diisi." },
        { status: 400 }
      );
    }

    // Pastikan dosen ada
    const dosen = await prisma.user.findUnique({
      where: { email: dosenEmail },
    });

    if (!dosen) {
      return NextResponse.json(
        { message: "Dosen yang dipilih tidak ditemukan." },
        { status: 404 }
      );
    }

    const newMatkul = await prisma.mataKuliah.create({
      data: {
        nama: nama.trim(),
        kode: kode ? kode.trim() : null,
        sks: sks ? Number(sks) : 3,
        semester: semester ? semester.trim() : null,
        dosenEmail,
      },
      include: {
        dosen: {
          include: {
            profilDosen: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Mata kuliah berhasil ditambahkan.",
      data: newMatkul,
    });
  } catch (error: unknown) {
    console.error("Error create mata kuliah:", error);
    const message = error instanceof Error ? error.message : "Terjadi kesalahan";
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "ID mata kuliah diperlukan." },
        { status: 400 }
      );
    }

    await prisma.mataKuliah.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Mata kuliah berhasil dihapus.",
    });
  } catch (error: unknown) {
    console.error("Error delete mata kuliah:", error);
    const message = error instanceof Error ? error.message : "Terjadi kesalahan";
    return NextResponse.json({ message }, { status: 500 });
  }
}
