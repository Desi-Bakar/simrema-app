import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email dan password wajib diisi." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // Cari user di database
    const user = await prisma.user.findUnique({
      where: { email: cleanEmail },
      include: { profilDosen: true },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Email atau password salah." },
        { status: 401 }
      );
    }

    // Cek status akun
    if (user.status === "PENDING") {
      return NextResponse.json(
        {
          message:
            "Akun Anda masih dalam status PENDING (Menunggu ACC/persetujuan dari Admin).",
        },
        { status: 403 }
      );
    }

    if (user.status === "REJECTED") {
      return NextResponse.json(
        { message: "Permintaan akses akun Anda telah ditolak oleh Admin." },
        { status: 403 }
      );
    }

    // Verifikasi password sederhana (atau bcrypt jika digunakan)
    if (user.password !== password) {
      return NextResponse.json(
        { message: "Email atau password salah." },
        { status: 401 }
      );
    }

    const userData = {
      email: user.email,
      role: user.role,
      status: user.status,
      nama: user.profilDosen?.nama || (user.role === "ADMIN" ? "Administrator" : "Dosen"),
      telepon: user.profilDosen?.telepon || "",
      prodi: user.profilDosen?.prodi || "",
      alamat: user.profilDosen?.alamat || "",
      foto: user.profilDosen?.foto || "/profil.png",
    };

    const response = NextResponse.json({
      success: true,
      message: "Login berhasil",
      user: userData,
    });

    // Set cookie sederhana untuk session
    response.cookies.set("simrema_user", JSON.stringify(userData), {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 hari
    });

    return response;
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan server saat login." },
      { status: 500 }
    );
  }
}
