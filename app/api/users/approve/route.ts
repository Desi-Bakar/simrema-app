import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email) {
      return NextResponse.json(
        { message: "Email user wajib disertakan." },
        { status: 400 }
      );
    }

    // Default password jika admin tidak menentukan password khusus
    const assignedPassword = password || "dosen123";

    const updatedUser = await prisma.user.update({
      where: { email },
      data: {
        status: "APPROVED",
        password: assignedPassword,
      },
      include: {
        profilDosen: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Akses untuk ${updatedUser.profilDosen?.nama || email} berhasil disetujui (ACC). Password awal: ${assignedPassword}`,
      data: updatedUser,
    });
  } catch (error: any) {
    console.error("Error approving user:", error);
    return NextResponse.json(
      { message: "Gagal menyetujui user: " + error.message },
      { status: 500 }
    );
  }
}
