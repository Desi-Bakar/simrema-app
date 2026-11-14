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
import { put, get, del } from "@vercel/blob";
import path from "path";
import { randomUUID } from "crypto";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

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

type RequestData = {
  fields: Record<string, string>;
  file: File | null;
};

// =====================================================
// MEMBACA REQUEST JSON ATAU FORMDATA
// =====================================================

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

// =====================================================
// VALIDASI FILE
// =====================================================

function validateFile(file: File) {
  const extension = path.extname(file.name).toLowerCase();
  const allowedMimes = ALLOWED_TYPES[extension];

  if (!allowedMimes) {
    throw new Error(
      "Format file harus PDF, DOC, DOCX, PPT, atau PPTX."
    );
  }

  if (file.type && !allowedMimes.includes(file.type)) {
    throw new Error(
      "Jenis file tidak sesuai dengan format file."
    );
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error("Ukuran file maksimal 10 MB.");
  }

  return extension;
}

// =====================================================
// MEMERIKSA URL PRIVATE BLOB
// =====================================================

function isPrivateBlobUrl(value: string | null): value is string {
  if (!value) return false;

  try {
    const url = new URL(value);

    return (
      url.protocol === "https:" &&
      url.hostname.endsWith(
        ".private.blob.vercel-storage.com"
      )
    );
  } catch {
    return false;
  }
}

// =====================================================
// UPLOAD FILE KE VERCEL BLOB PRIVATE
// =====================================================

async function saveFile(file: File) {
  const extension = validateFile(file);

  const pathname = `materi/${randomUUID()}${extension}`;

  const blob = await put(pathname, file, {
    access: "private",
    addRandomSuffix: true,
    contentType: file.type || "application/octet-stream",
  });

  // URL ini akan melewati API kita sendiri.
  // Karena Blob bersifat private, file tidak dibuka
  // langsung melalui URL Blob.
  const params = new URLSearchParams({
    download: blob.url,
    filename: file.name,
  });

  return {
    fileUrl: `/api/materi?${params.toString()}`,
    fileName: file.name,
    fileSize: file.size,
    fileType: file.type || extension,
  };
}

// =====================================================
// MENGHAPUS FILE DARI VERCEL BLOB
// =====================================================

async function removeFile(fileUrl?: string | null) {
  if (!fileUrl) return;

  try {
    const parsed = new URL(
      fileUrl,
      "https://simrema.local"
    );

    let blobUrl: string | null = null;

    // Format fileUrl baru dari aplikasi
    if (parsed.pathname === "/api/materi") {
      blobUrl = parsed.searchParams.get("download");
    }
    // Mendukung URL Blob langsung jika ada data lama
    else if (isPrivateBlobUrl(fileUrl)) {
      blobUrl = fileUrl;
    }

    if (!isPrivateBlobUrl(blobUrl)) return;

    await del(blobUrl, {
      // access: "private",
    });
  } catch (error) {
    console.error("Gagal menghapus file Blob:", error);
  }
}

// =====================================================
// MEMERIKSA ERROR PRISMA
// =====================================================

function isPrismaError(error: unknown, code: string) {
  return (
    error !== null &&
    typeof error === "object" &&
    "code" in error &&
    error.code === code
  );
}

// =====================================================
// GET: DATA REKAP ATAU DOWNLOAD FILE
// =====================================================

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    // Jika ada parameter download, ambil file dari Blob.
    const downloadUrl = searchParams.get("download");

    if (downloadUrl) {
      if (!isPrivateBlobUrl(downloadUrl)) {
        return NextResponse.json(
          { success: false, message: "URL file tidak valid." },
          { status: 400 }
        );
      }

      const result = await get(downloadUrl, {
        access: "private",
      });

      if (!result) {
        return NextResponse.json(
          { success: false, message: "File tidak ditemukan." },
          { status: 404 }
        );
      }

      const requestedName =
        searchParams.get("filename") || "materi";

      // Membersihkan karakter kontrol dari nama file.
      const safeName = requestedName.replace(
        /[\r\n"]/g,
        "_"
      );

      return new Response(result.stream, {
        status: 200,
        headers: {
          "Content-Type":
            result.blob.contentType ||
            "application/octet-stream",
          "Content-Disposition":
            `inline; filename*=UTF-8''${encodeURIComponent(safeName)}`,
          "Content-Length": String(result.blob.size),
          "Cache-Control": "private, no-store",
          "X-Content-Type-Options": "nosniff",
        },
      });
    }

    // Mengambil master mata kuliah
    const type = searchParams.get("type");

    if (type === "mata-kuliah") {
      const mataKuliah = await prisma.mataKuliah.findMany({
        select: {
          id: true,
          nama: true,
        },
        orderBy: {
          nama: "asc",
        },
      });

      return NextResponse.json({
        success: true,
        data: mataKuliah,
      });
    }

    // Mengambil data rekap materi
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
              select: {
                nama: true,
              },
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
      error instanceof Error
        ? error.message
        : "Terjadi kesalahan";

    return NextResponse.json(
      { success: false, message },
      { status: 500 }
    );
  }
}

// =====================================================
// POST: MENAMBAHKAN MATERI AJAR
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

    // Mencari mata kuliah berdasarkan nama jika ID kosong.
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

    const existing = await prisma.rekapMateri.findFirst({
      where: {
        mataKuliahId: targetMatkulId,
        tahunAjaran: tahun,
        semester: sem,
        pertemuan: nomor,
      },
    });

    // Upload file baru jika ada.
    const uploadedFile = file
      ? await saveFile(file)
      : null;

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
      error instanceof Error
        ? error.message
        : "Terjadi kesalahan";

    return NextResponse.json(
      { message },
      { status: 500 }
    );
  }
}

// =====================================================
// PUT: MEMPERBARUI MATERI AJAR DAN FILE
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

    const targetMatkulId =
      mataKuliahId || existing.mataKuliahId;

    const targetTahun =
      tahunAjaran !== undefined
        ? tahunAjaran.trim() || null
        : existing.tahunAjaran;

    const targetSemester =
      semester !== undefined
        ? semester.trim() || null
        : existing.semester;

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
        {
          message:
            "Pertemuan tersebut sudah ada pada mata kuliah ini.",
        },
        { status: 409 }
      );
    }

    const uploadedFile = file
      ? await saveFile(file)
      : null;

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
      error instanceof Error
        ? error.message
        : "Terjadi kesalahan";

    return NextResponse.json(
      { message },
      { status: 500 }
    );
  }
}

// =====================================================
// DELETE: MENGHAPUS MATERI DAN FILE
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

    await removeFile(existing.fileUrl);

    return NextResponse.json({
      success: true,
      message: "Materi dan file berhasil dihapus.",
    });
  } catch (error: unknown) {
    console.error("Error DELETE materi:", error);

    const message =
      error instanceof Error
        ? error.message
        : "Terjadi kesalahan";

    return NextResponse.json(
      { message },
      { status: 500 }
    );
  }
}
