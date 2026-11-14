// import { NextResponse } from "next/server";
// import { prisma } from "../../lib/prisma";

// export async function GET(req: Request) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const email = searchParams.get("email");
//     const role = searchParams.get("role");
//     const mataKuliahId = searchParams.get("mataKuliahId");

//     const where: { mataKuliahId?: string; dosenEmail?: string } = {};
//     if (mataKuliahId) where.mataKuliahId = mataKuliahId;
//     if (role === "DOSEN" && email) where.dosenEmail = email;

//     const data = await prisma.rekapMateri.findMany({
//       where,
//       include: {
//         mataKuliah: { select: { id: true, nama: true, kode: true, dosenEmail: true } },
//         dosen: { select: { email: true, profilDosen: { select: { nama: true } } } },
//       },
//       orderBy: [{ tanggal: "desc" }, { pertemuan: "desc" }],
//     });

//     return NextResponse.json({ success: true, data });
//   } catch (error: unknown) {
//     const message = error instanceof Error ? error.message : "Terjadi kesalahan";
//     return NextResponse.json({ message }, { status: 500 });
//   }
// }

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
//     const { mataKuliahId, mataKuliah, tanggal, pertemuan, materi, tugas, dosenEmail } = body;

//     let targetMatkulId = mataKuliahId;

//     if (!targetMatkulId && mataKuliah) {
//       const found = await prisma.mataKuliah.findFirst({
//         where: { nama: { equals: String(mataKuliah).trim(), mode: "insensitive" } },
//       });
//       if (found) {
//         targetMatkulId = found.id;
//       } else if (dosenEmail) {
//         const created = await prisma.mataKuliah.create({
//           data: { nama: String(mataKuliah).trim(), dosenEmail },
//         });
//         targetMatkulId = created.id;
//       }
//     }

//     if (!targetMatkulId) {
//       return NextResponse.json({ message: "Mata kuliah wajib dipilih." }, { status: 400 });
//     }

//     const matkul = await prisma.mataKuliah.findUnique({ where: { id: targetMatkulId } });
//     if (!matkul) {
//       return NextResponse.json({ message: "Mata kuliah tidak ditemukan." }, { status: 404 });
//     }

//     const user = dosenEmail ? await prisma.user.findUnique({ where: { email: dosenEmail } }) : null;
//     const assignedDosen = user ? user.email : matkul.dosenEmail;
//     const nomor = Number(pertemuan) || 1;
//     const tgl = tanggal ? new Date(tanggal) : new Date();

//     const saved = await prisma.rekapMateri.upsert({
//       where: {
//         mataKuliahId_pertemuan: { mataKuliahId: targetMatkulId, pertemuan: nomor },
//       },
//       update: {
//         tanggal: tgl,
//         materi: String(materi || ""),
//         tugas: tugas ? String(tugas) : null,
//         dosenEmail: assignedDosen,
//       },
//       create: {
//         mataKuliahId: targetMatkulId,
//         pertemuan: nomor,
//         tanggal: tgl,
//         materi: String(materi || ""),
//         tugas: tugas ? String(tugas) : null,
//         dosenEmail: assignedDosen,
//       },
//     });

//     return NextResponse.json({
//       success: true,
//       message: "Materi perkuliahan berhasil disimpan.",
//       data: saved,
//     });
//   } catch (error: unknown) {
//     const message = error instanceof Error ? error.message : "Terjadi kesalahan";
//     return NextResponse.json({ message }, { status: 500 });
//   }
// }

// export async function PUT(req: Request) {
//   try {
//     const body = await req.json();
//     const { id, mataKuliahId, pertemuan, tanggal, materi, tugas } = body;

//     let updated;
//     if (id) {
//       updated = await prisma.rekapMateri.update({
//         where: { id },
//         data: {
//           pertemuan: pertemuan ? Number(pertemuan) : undefined,
//           tanggal: tanggal ? new Date(tanggal) : undefined,
//           materi: materi !== undefined ? String(materi) : undefined,
//           tugas: tugas !== undefined ? (tugas ? String(tugas) : null) : undefined,
//         },
//       });
//     } else if (mataKuliahId && pertemuan) {
//       updated = await prisma.rekapMateri.update({
//         where: {
//           mataKuliahId_pertemuan: { mataKuliahId, pertemuan: Number(pertemuan) },
//         },
//         data: {
//           tanggal: tanggal ? new Date(tanggal) : undefined,
//           materi: materi !== undefined ? String(materi) : undefined,
//           tugas: tugas !== undefined ? (tugas ? String(tugas) : null) : undefined,
//         },
//       });
//     } else {
//       return NextResponse.json({ message: "Data tidak valid." }, { status: 400 });
//     }

//     return NextResponse.json({
//       success: true,
//       message: "Materi perkuliahan berhasil diperbarui.",
//       data: updated,
//     });
//   } catch (error: unknown) {
//     console.error("Error update materi:", error);
//     if (error && typeof error === "object" && "code" in error && error.code === "P2002") {
//       return NextResponse.json({ message: "Pertemuan ini sudah ada untuk mata kuliah tersebut." }, { status: 409 });
//     }
//     const message = error instanceof Error ? error.message : "Terjadi kesalahan";
//     return NextResponse.json({ message }, { status: 500 });
//   }
// }

// export async function DELETE(req: Request) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const id = searchParams.get("id");
//     if (!id) return NextResponse.json({ message: "ID diperlukan." }, { status: 400 });

//     await prisma.rekapMateri.delete({ where: { id } });
//     return NextResponse.json({ success: true, message: "Berhasil dihapus." });
//   } catch (error: unknown) {
//     console.error("Error delete materi:", error);
//     if (error && typeof error === "object" && "code" in error && error.code === "P2025") {
//       return NextResponse.json({ message: "Rekap materi tidak ditemukan." }, { status: 404 });
//     }
//     const message = error instanceof Error ? error.message : "Terjadi kesalahan";
//     return NextResponse.json({ message }, { status: 500 });
//   }
// }


// dari no 1-162 ini codingan lama sebelum di revisi


import { NextResponse } from "next/server";
import { prisma } from "../../lib/prisma";
import { mkdir, writeFile, unlink } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

// Gunakan Node.js runtime untuk akses penyimpanan file
export const runtime = "nodejs";

// Batas ukuran file: 10 MB
const MAX_FILE_SIZE = 10 * 1024 * 1024;

// Format file yang diperbolehkan
const ALLOWED_TYPES: Record<string, string[]> = {
  ".pdf": ["application/pdf"],
  ".doc": ["application/msword"],
  ".docx": [
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
  ".ppt": ["application/vnd.ms-powerpoint"],
  ".pptx": [
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  ],
};

// Struktur data dari request
type RequestData = {
  fields: Record<string, string>;
  file: File | null;
};

// Membaca JSON atau FormData
async function readRequest(req: Request): Promise<RequestData> {
  const contentType = req.headers.get("content-type") || "";

  if (contentType.includes("multipart/form-data")) {
    const formData = await req.formData();

    const fields: Record<string, string> = {};

    formData.forEach((value, key) => {
      if (typeof value === "string") {
        fields[key] = value;
      }
    });

    const uploaded = formData.get("file");

    const file =
      uploaded &&
      typeof uploaded !== "string" &&
      uploaded.size > 0
        ? uploaded
        : null;

    return { fields, file };
  }

  const body = await req.json();

  return {
    fields: body as Record<string, string>,
    file: null,
  };
}

// Menyimpan file ke public/uploads/materi
async function saveFile(file: File) {
  const extension = path.extname(file.name).toLowerCase();

  const allowedMimes = ALLOWED_TYPES[extension];

  if (!allowedMimes) {
    throw new Error("Format file harus PDF, DOC, DOCX, PPT, atau PPTX.");
  }

  if (file.type && !allowedMimes.includes(file.type)) {
    throw new Error("Jenis file tidak sesuai dengan format file.");
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error("Ukuran file maksimal 10 MB.");
  }

  const folder = path.join(
    process.cwd(),
    "public",
    "uploads",
    "materi"
  );

  await mkdir(folder, { recursive: true });

  const fileName = `${randomUUID()}${extension}`;
  const filePath = path.join(folder, fileName);

  const buffer = Buffer.from(await file.arrayBuffer());

  await writeFile(filePath, buffer);

  return {
    fileUrl: `/uploads/materi/${fileName}`,
    fileName: file.name,
    fileSize: file.size,
    fileType: file.type || extension,
  };
}

// Menghapus file lama dari penyimpanan
async function removeFile(fileUrl?: string | null) {
  if (!fileUrl) return;

  const prefix = "/uploads/materi/";

  // Hanya boleh menghapus file di folder materi
  if (!fileUrl.startsWith(prefix)) return;

  const fileName = fileUrl.slice(prefix.length);

  // Pastikan nama file tidak mengandung path tambahan
  if (!fileName || path.basename(fileName) !== fileName) return;

  const filePath = path.join(
    process.cwd(),
    "public",
    "uploads",
    "materi",
    fileName
  );

  try {
    await unlink(filePath);
  } catch (error) {
    const code =
      error && typeof error === "object" && "code" in error
        ? error.code
        : "";

    if (code !== "ENOENT") {
      console.error("Gagal menghapus file:", error);
    }
  }
}

// Memeriksa error Prisma
function isPrismaError(error: unknown, code: string) {
  return (
    error !== null &&
    typeof error === "object" &&
    "code" in error &&
    error.code === code
  );
}

// =====================================================
// GET: Mengambil data rekap materi
// =====================================================

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const email = searchParams.get("email");
    const role = searchParams.get("role");
    const id = searchParams.get("id");
    const mataKuliahId = searchParams.get("mataKuliahId");
    const tahunAjaran = searchParams.get("tahunAjaran");
    const semester = searchParams.get("semester");

    const where: {
      id?: string;
      mataKuliahId?: string;
      dosenEmail?: string;
      tahunAjaran?: string;
      semester?: string;
    } = {};

    if (id) where.id = id;
    if (mataKuliahId) where.mataKuliahId = mataKuliahId;

    if (role === "DOSEN" && email) {
      where.dosenEmail = email;
    }

    if (tahunAjaran) where.tahunAjaran = tahunAjaran;
    if (semester) where.semester = semester;

    const data = await prisma.rekapMateri.findMany({
      where,
      include: {
        mataKuliah: {
          select: {
            id: true,
            nama: true,
            kode: true,
            dosenEmail: true,
          },
        },
        dosen: {
          select: {
            email: true,
            profilDosen: {
              select: { nama: true },
            },
          },
        },
      },
      orderBy: [
        { tanggal: "desc" },
        { pertemuan: "desc" },
      ],
    });

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error: unknown) {
    console.error("Error GET materi:", error);

    const message =
      error instanceof Error ? error.message : "Terjadi kesalahan";

    return NextResponse.json({ message }, { status: 500 });
  }
}

// =====================================================
// POST: Menambahkan materi ajar
// Mendukung JSON dan FormData
// =====================================================

export async function POST(req: Request) {
  let newFileUrl: string | null = null;

  try {
    const { fields, file } = await readRequest(req);

    const {
      mataKuliahId,
      mataKuliah,
      tahunAjaran,
      semester,
      tanggal,
      pertemuan,
      materi,
      tugas,
      dosenEmail,
    } = fields;

    let targetMatkulId = mataKuliahId;

    // Jika mata kuliah belum dipilih berdasarkan ID
    if (!targetMatkulId && mataKuliah) {
      const found = await prisma.mataKuliah.findFirst({
        where: {
          nama: {
            equals: mataKuliah.trim(),
            mode: "insensitive",
          },
          ...(dosenEmail ? { dosenEmail } : {}),
        },
      });

      if (found) {
        targetMatkulId = found.id;
      } else if (dosenEmail) {
        const created = await prisma.mataKuliah.create({
          data: {
            nama: mataKuliah.trim(),
            dosenEmail,
          },
        });

        targetMatkulId = created.id;
      }
    }

    if (!targetMatkulId) {
      return NextResponse.json(
        { message: "Mata kuliah wajib dipilih." },
        { status: 400 }
      );
    }

    const matkul = await prisma.mataKuliah.findUnique({
      where: { id: targetMatkulId },
    });

    if (!matkul) {
      return NextResponse.json(
        { message: "Mata kuliah tidak ditemukan." },
        { status: 404 }
      );
    }

    const user = dosenEmail
      ? await prisma.user.findUnique({
          where: { email: dosenEmail },
        })
      : null;

    const assignedDosen = user
      ? user.email
      : matkul.dosenEmail;

    const nomor = Number(pertemuan);

    if (!Number.isInteger(nomor) || nomor < 1) {
      return NextResponse.json(
        { message: "Nomor pertemuan tidak valid." },
        { status: 400 }
      );
    }

    const tgl = tanggal ? new Date(tanggal) : new Date();

    if (isNaN(tgl.getTime())) {
      return NextResponse.json(
        { message: "Tanggal tidak valid." },
        { status: 400 }
      );
    }

    const tahun = tahunAjaran?.trim() || null;
    const sem = semester?.trim() || null;

    // Cari data dengan kombinasi mata kuliah,
    // tahun ajaran, semester, dan pertemuan.
    const existing = await prisma.rekapMateri.findFirst({
      where: {
        mataKuliahId: targetMatkulId,
        tahunAjaran: tahun,
        semester: sem,
        pertemuan: nomor,
      },
    });

    // Upload file jika ada
    const uploadedFile = file ? await saveFile(file) : null;

    if (uploadedFile) {
      newFileUrl = uploadedFile.fileUrl;
    }

    const dataMateri = {
      tanggal: tgl,
      materi: materi || "",
      tugas: tugas?.trim() || null,
      tahunAjaran: tahun,
      semester: sem,
      dosenEmail: assignedDosen,
      ...(uploadedFile || {}),
    };

    let saved;

    if (existing) {
      saved = await prisma.rekapMateri.update({
        where: { id: existing.id },
        data: dataMateri,
      });

      if (uploadedFile) {
        await removeFile(existing.fileUrl);
      }
    } else {
      saved = await prisma.rekapMateri.create({
        data: {
          mataKuliahId: targetMatkulId,
          pertemuan: nomor,
          ...dataMateri,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Materi perkuliahan berhasil disimpan.",
      data: saved,
    });
  } catch (error: unknown) {
    // Bersihkan file baru jika penyimpanan database gagal
    if (newFileUrl) {
      await removeFile(newFileUrl);
    }

    console.error("Error POST materi:", error);

    if (isPrismaError(error, "P2002")) {
      return NextResponse.json(
        { message: "Pertemuan tersebut sudah terdaftar." },
        { status: 409 }
      );
    }

    const message =
      error instanceof Error ? error.message : "Terjadi kesalahan";

    return NextResponse.json({ message }, { status: 500 });
  }
}

// =====================================================
// PUT: Memperbarui materi ajar dan file
// Mendukung JSON dan FormData
// =====================================================

export async function PUT(req: Request) {
  let newFileUrl: string | null = null;

  try {
    const { fields, file } = await readRequest(req);

    const {
      id,
      mataKuliahId,
      tahunAjaran,
      semester,
      pertemuan,
      tanggal,
      materi,
      tugas,
      removeFile: shouldRemoveFile,
    } = fields;

    if (!id) {
      return NextResponse.json(
        { message: "ID materi wajib disertakan." },
        { status: 400 }
      );
    }

    // Cari data lama
    const existing = await prisma.rekapMateri.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { message: "Data materi tidak ditemukan." },
        { status: 404 }
      );
    }

    const nomor =
      pertemuan !== undefined
        ? Number(pertemuan)
        : existing.pertemuan;

    if (!Number.isInteger(nomor) || nomor < 1) {
      return NextResponse.json(
        { message: "Nomor pertemuan tidak valid." },
        { status: 400 }
      );
    }

    const tgl = tanggal
      ? new Date(tanggal)
      : undefined;

    if (tgl && isNaN(tgl.getTime())) {
      return NextResponse.json(
        { message: "Tanggal tidak valid." },
        { status: 400 }
      );
    }

    const targetMatkulId = mataKuliahId || existing.mataKuliahId;
    const targetTahun =
      tahunAjaran !== undefined
        ? tahunAjaran.trim() || null
        : existing.tahunAjaran;

    const targetSemester =
      semester !== undefined
        ? semester.trim() || null
        : existing.semester;

    // Pastikan mata kuliah tujuan tersedia
    if (mataKuliahId) {
      const matkul = await prisma.mataKuliah.findUnique({
        where: { id: mataKuliahId },
      });

      if (!matkul) {
        return NextResponse.json(
          { message: "Mata kuliah tidak ditemukan." },
          { status: 404 }
        );
      }
    }

    // Periksa duplikasi pertemuan
    const duplicate = await prisma.rekapMateri.findFirst({
      where: {
        id: { not: id },
        mataKuliahId: targetMatkulId,
        tahunAjaran: targetTahun,
        semester: targetSemester,
        pertemuan: nomor,
      },
    });

    if (duplicate) {
      return NextResponse.json(
        { message: "Pertemuan tersebut sudah ada pada mata kuliah ini." },
        { status: 409 }
      );
    }

    // Upload file baru jika dipilih
    const uploadedFile = file ? await saveFile(file) : null;

    if (uploadedFile) {
      newFileUrl = uploadedFile.fileUrl;
    }

    const removeOldFile = shouldRemoveFile === "true";

    const fileData = uploadedFile
      ? uploadedFile
      : removeOldFile
        ? {
            fileUrl: null,
            fileName: null,
            fileSize: null,
            fileType: null,
          }
        : {};

    const updated = await prisma.rekapMateri.update({
      where: { id },
      data: {
        mataKuliahId: targetMatkulId,
        tahunAjaran: targetTahun,
        semester: targetSemester,
        pertemuan: nomor,
        tanggal: tgl,
        materi:
          materi !== undefined
            ? materi
            : undefined,
        tugas:
          tugas !== undefined
            ? tugas.trim() || null
            : undefined,
        ...fileData,
      },
    });

    // Hapus file lama setelah database berhasil diperbarui
    if (uploadedFile || removeOldFile) {
      await removeFile(existing.fileUrl);
    }

    return NextResponse.json({
      success: true,
      message: "Materi perkuliahan berhasil diperbarui.",
      data: updated,
    });
  } catch (error: unknown) {
    if (newFileUrl) {
      await removeFile(newFileUrl);
    }

    console.error("Error PUT materi:", error);

    if (isPrismaError(error, "P2002")) {
      return NextResponse.json(
        { message: "Pertemuan ini sudah terdaftar." },
        { status: 409 }
      );
    }

    if (isPrismaError(error, "P2025")) {
      return NextResponse.json(
        { message: "Data materi tidak ditemukan." },
        { status: 404 }
      );
    }

    const message =
      error instanceof Error ? error.message : "Terjadi kesalahan";

    return NextResponse.json({ message }, { status: 500 });
  }
}

// =====================================================
// DELETE: Menghapus materi beserta file
// =====================================================

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "ID diperlukan." },
        { status: 400 }
      );
    }

    const existing = await prisma.rekapMateri.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { message: "Rekap materi tidak ditemukan." },
        { status: 404 }
      );
    }

    await prisma.rekapMateri.delete({
      where: { id },
    });

    // Hapus file fisik setelah data berhasil dihapus
    await removeFile(existing.fileUrl);

    return NextResponse.json({
      success: true,
      message: "Materi dan file berhasil dihapus.",
    });
  } catch (error: unknown) {
    console.error("Error DELETE materi:", error);

    const message =
      error instanceof Error ? error.message : "Terjadi kesalahan";

    return NextResponse.json({ message }, { status: 500 });
  }
}

