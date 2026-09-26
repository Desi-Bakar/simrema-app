import { NextResponse } from "next/server";
import { prisma } from "../../lib/prisma";

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      include: {
        profilDosen: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const pendingRequests = users.filter((u) => u.status === "PENDING");
    const activeUsers = users.filter((u) => u.status === "APPROVED");
    const rejectedUsers = users.filter((u) => u.status === "REJECTED");

    return NextResponse.json({
      success: true,
      data: {
        all: users,
        pending: pendingRequests,
        active: activeUsers,
        rejected: rejectedUsers,
        counts: {
          total: users.length,
          pending: pendingRequests.length,
          active: activeUsers.length,
          rejected: rejectedUsers.length,
        },
      },
    });
  } catch (error: any) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { message: "Gagal mengambil data user: " + error.message },
      { status: 500 }
    );
  }
}
