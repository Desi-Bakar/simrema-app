import { NextResponse } from "next/server";
import { prisma } from "../../lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { namaLengkap, alamatEmail, nomorTelepon } = body;

    // Validasi input
    if (!namaLengkap || !alamatEmail || !nomorTelepon) {
      return NextResponse.json(
        { message: "Nama lengkap, email, dan nomor telepon wajib diisi." },
        { status: 400 }
      );
    }

    const email = alamatEmail.trim().toLowerCase();
    const nama = namaLengkap.trim();
    const telepon = nomorTelepon.trim();

    // 1. Cek apakah email sudah terdaftar
    const existingUser = await prisma.user.findUnique({
      where: { email },
      include: { profilDosen: true },
    });

    if (existingUser) {
      if (existingUser.status === "PENDING") {
        return NextResponse.json(
          {
            message:
              "Permintaan akses untuk email ini sudah dikirim sebelumnya dan sedang menunggu persetujuan Admin.",
          },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { message: "Email ini sudah terdaftar sebagai akun aktif." },
        { status: 409 }
      );
    }

    // 2. Buat User (status PENDING, password null) dan ProfilDosen dalam 1 transaksi
    const newUser = await prisma.user.create({
      data: {
        email,
        password: null, // Belum ada password saat request access
        role: "DOSEN",
        status: "PENDING",
        profilDosen: {
          create: {
            nama,
            telepon,
          },
        },
      },
      include: {
        profilDosen: true,
      },
    });

    return NextResponse.json({
      success: true,
      message:
        "Permintaan akses berhasil dikirim! Akun Anda sedang menunggu konfirmasi (ACC) dari Admin.",
      data: {
        email: newUser.email,
        nama: newUser.profilDosen?.nama,
        telepon: newUser.profilDosen?.telepon,
        status: newUser.status,
      },
    });
  } catch (error: unknown) {
    console.error("Error request access:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { message: "Terjadi kesalahan pada server: " + message },
      { status: 500 }
    );
  }
}
