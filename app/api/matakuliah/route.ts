// import { NextResponse } from "next/server";
// import { prisma } from "../../lib/prisma";

// export async function GET(req: Request) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const email = searchParams.get("email");
//     const role = searchParams.get("role");

//     // Jika DOSEN, hanya muncul mata kuliah yang di-assign ke dia
//     // Jika ADMIN, muncul semua mata kuliah
//     const whereClause =
//       role === "DOSEN" && email
//         ? { dosenEmail: email }
//         : {};

//     const mataKuliah = await prisma.mataKuliah.findMany({
//       where: whereClause,
//       include: {
//         dosen: {
//           select: {
//             email: true,
//             profilDosen: {
//               select: {
//                 nama: true,
//               },
//             },
//           },
//         },
//         _count: {
//           select: {
//             rekapMateri: true,
//           },
//         },
//       },
//       orderBy: {
//         createdAt: "desc",
//       },
//     });

//     return NextResponse.json({
//       success: true,
//       data: mataKuliah,
//     });
//   } catch (error: unknown) {
//     console.error("Error get mata kuliah:", error);
//     const message = error instanceof Error ? error.message : "Terjadi kesalahan";
//     return NextResponse.json({ message }, { status: 500 });
//   }
// }

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
//     const { nama, kode, sks, semester, dosenEmail } = body;

//     if (!nama || !dosenEmail) {
//       return NextResponse.json(
//         { message: "Nama mata kuliah dan Dosen pengampu wajib diisi." },
//         { status: 400 }
//       );
//     }

//     // Pastikan dosen ada
//     const dosen = await prisma.user.findUnique({
//       where: { email: dosenEmail },
//     });

//     if (!dosen) {
//       return NextResponse.json(
//         { message: "Dosen yang dipilih tidak ditemukan." },
//         { status: 404 }
//       );
//     }

//     const newMatkul = await prisma.mataKuliah.create({
//       data: {
//         nama: nama.trim(),
//         kode: kode ? kode.trim() : null,
//         sks: sks ? Number(sks) : 3,
//         semester: semester ? semester.trim() : null,
//         dosenEmail,
//       },
//       include: {
//         dosen: {
//           include: {
//             profilDosen: true,
//           },
//         },
//       },
//     });

//     return NextResponse.json({
//       success: true,
//       message: "Mata kuliah berhasil ditambahkan.",
//       data: newMatkul,
//     });
//   } catch (error: unknown) {
//     console.error("Error create mata kuliah:", error);
//     const message = error instanceof Error ? error.message : "Terjadi kesalahan";
//     return NextResponse.json({ message }, { status: 500 });
//   }
// }

// export async function DELETE(req: Request) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const id = searchParams.get("id");

//     if (!id) {
//       return NextResponse.json(
//         { message: "ID mata kuliah diperlukan." },
//         { status: 400 }
//       );
//     }

//     await prisma.mataKuliah.delete({
//       where: { id },
//     });

//     return NextResponse.json({
//       success: true,
//       message: "Mata kuliah berhasil dihapus.",
//     });
//   } catch (error: unknown) {
//     console.error("Error delete mata kuliah:", error);
//     const message = error instanceof Error ? error.message : "Terjadi kesalahan";
//     return NextResponse.json({ message }, { status: 500 });
//   }
// }


//dari no 1-130 codingan lama sebelum di revisi


import { NextResponse } from "next/server";
import { prisma } from "../../lib/prisma";

// ==========================================
// GET: Mengambil data mata kuliah
// ==========================================
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    const role = searchParams.get("role");

    // Admin melihat semua mata kuliah.
    // Dosen hanya melihat mata kuliah yang ditugaskan kepadanya.
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

    const message =
      error instanceof Error ? error.message : "Terjadi kesalahan";

    return NextResponse.json(
      { success: false, message },
      { status: 500 }
    );
  }
}

// ==========================================
// POST: Menambahkan mata kuliah baru
// ==========================================
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      tahunAjaran,
      semester,
      nama,
      kode,
      sks,
      dosenEmail,
    } = body;

    // Validasi data wajib
    if (
      !tahunAjaran?.trim() ||
      !semester?.trim() ||
      !nama?.trim() ||
      !dosenEmail?.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Tahun ajaran, semester, nama mata kuliah, dan dosen pengampu wajib diisi.",
        },
        { status: 400 }
      );
    }

    // Validasi semester
    if (!["Ganjil", "Genap"].includes(semester.trim())) {
      return NextResponse.json(
        {
          success: false,
          message: "Semester harus Ganjil atau Genap.",
        },
        { status: 400 }
      );
    }

    // Validasi SKS
    const jumlahSks = Number(sks);

    if (!Number.isInteger(jumlahSks) || jumlahSks < 1 || jumlahSks > 6) {
      return NextResponse.json(
        {
          success: false,
          message: "Jumlah SKS harus antara 1 sampai 6.",
        },
        { status: 400 }
      );
    }

    // Pastikan dosen yang dipilih tersedia
    const dosen = await prisma.user.findUnique({
      where: {
        email: dosenEmail.trim(),
      },
    });

    if (!dosen || dosen.role !== "DOSEN") {
      return NextResponse.json(
        {
          success: false,
          message: "Dosen pengampu tidak ditemukan.",
        },
        { status: 404 }
      );
    }

    // Simpan mata kuliah ke database
    const newMatkul = await prisma.mataKuliah.create({
      data: {
        tahunAjaran: tahunAjaran.trim(),
        semester: semester.trim(),
        nama: nama.trim(),
        kode: kode?.trim() || null,
        sks: jumlahSks,
        dosenEmail: dosenEmail.trim(),
      },
      include: {
        dosen: {
          include: {
            profilDosen: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Mata kuliah berhasil ditambahkan.",
        data: newMatkul,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Error create mata kuliah:", error);

    const message =
      error instanceof Error ? error.message : "Terjadi kesalahan";

    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: 500 }
    );
  }
}

// ==========================================
// DELETE: Menghapus mata kuliah
// ==========================================
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "ID mata kuliah diperlukan.",
        },
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

    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "P2025"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Mata kuliah tidak ditemukan.",
        },
        { status: 404 }
      );
    }

    const message =
      error instanceof Error ? error.message : "Terjadi kesalahan";

    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: 500 }
    );
  }
}
