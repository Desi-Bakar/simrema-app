import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { message: "Email user wajib disertakan." },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { email },
      data: {
        status: "REJECTED",
      },
    });

    return NextResponse.json({
      success: true,
      message: `Permintaan akses untuk ${email} telah ditolak.`,
      data: updatedUser,
    });
  } catch (error: any) {
    console.error("Error rejecting user:", error);
    return NextResponse.json(
      { message: "Gagal menolak user: " + error.message },
      { status: 500 }
    );
  }
}
