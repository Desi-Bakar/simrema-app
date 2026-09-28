import { NextResponse } from "next/server";
import { prisma } from "../../lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { message: "Email diperlukan." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: { profilDosen: true },
    });

    if (!user) {
      return NextResponse.json(
        { message: "User tidak ditemukan." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        email: user.email,
        role: user.role,
        nama: user.profilDosen?.nama || (user.role === "ADMIN" ? "Administrator" : "Dosen"),
        telepon: user.profilDosen?.telepon || "",
        prodi: user.profilDosen?.prodi || "",
        alamat: user.profilDosen?.alamat || "",
        foto: user.profilDosen?.foto || "/profil.png",
      },
    });
  } catch (error: any) {
    console.error("Error get profile:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan: " + error.message },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { email, nama, telepon, prodi, alamat, foto, oldPassword, newPassword } = body;

    if (!email) {
      return NextResponse.json(
        { message: "Email wajib diisi." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { message: "User tidak ditemukan." },
        { status: 404 }
      );
    }

    // Ganti password jika request menyertakan newPassword
    if (newPassword) {
      if (user.password && oldPassword && user.password !== oldPassword) {
        return NextResponse.json(
          { message: "Password lama tidak sesuai." },
          { status: 400 }
        );
      }

      await prisma.user.update({
        where: { email },
        data: { password: newPassword },
      });

      return NextResponse.json({
        success: true,
        message: "Password berhasil diperbarui.",
      });
    }

    // Update profil dosen
    if (!nama) {
      return NextResponse.json(
        { message: "Nama lengkap wajib diisi." },
        { status: 400 }
      );
    }

    const updatedProfil = await prisma.profilDosen.upsert({
      where: { email },
      update: {
        nama,
        telepon: telepon || null,
        prodi: prodi || null,
        alamat: alamat || null,
        foto: foto || undefined,
      },
      create: {
        email,
        nama,
        telepon: telepon || null,
        prodi: prodi || null,
        alamat: alamat || null,
        foto: foto || "/profil.png",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Profil berhasil diperbarui.",
      data: updatedProfil,
    });
  } catch (error: any) {
    console.error("Error update profile:", error);
    return NextResponse.json(
      { message: "Gagal memperbarui: " + error.message },
      { status: 500 }
    );
  }
}
