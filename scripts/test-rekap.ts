// import assert from "node:assert";
// import { prisma } from "../app/lib/prisma";

// async function check() {
//   const admin = await prisma.user.findFirst({ where: { role: "ADMIN" } });
//   assert(admin, "Admin user must exist");

//   const matkul = await prisma.mataKuliah.findFirst();
//   assert(matkul, "At least one mata kuliah must exist");

//   // Create test rekap materi
//   const testPertemuan = 999;
//   const created = await prisma.rekapMateri.upsert({
//     where: {
//       mataKuliahId_pertemuan: { mataKuliahId: matkul.id, pertemuan: testPertemuan },
//     },
//     update: { materi: "Self check test materi", tugas: "Self check tugas" },
//     create: {
//       mataKuliahId: matkul.id,
//       dosenEmail: matkul.dosenEmail,
//       pertemuan: testPertemuan,
//       materi: "Self check test materi",
//       tugas: "Self check tugas",
//     },
//   });
//   assert.strictEqual(created.pertemuan, testPertemuan);

//   // Update test rekap materi
//   const updated = await prisma.rekapMateri.update({
//     where: { id: created.id },
//     data: { materi: "Updated self check materi" },
//   });
//   assert.strictEqual(updated.materi, "Updated self check materi");

//   // Cleanup test record
//   await prisma.rekapMateri.delete({ where: { id: created.id } });
//   const deleted = await prisma.rekapMateri.findUnique({ where: { id: created.id } });
//   assert.strictEqual(deleted, null, "Record should be deleted");

//   console.log("RekapMateri CRUD check passed.");
// }

// check()
//   .catch((e) => {
//     console.error(e);
//     process.exit(1);
//   })
//   .finally(() => prisma.$disconnect());




import assert from "node:assert";
import { prisma } from "../app/lib/prisma";

async function check() {
  // Memeriksa admin
  const admin = await prisma.user.findFirst({
    where: { role: "ADMIN" },
  });

  assert(admin, "Admin user must exist");

  // Mencari mata kuliah yang memiliki tahun ajaran dan semester
  const matkul = await prisma.mataKuliah.findFirst({
    where: {
      tahunAjaran: { not: null },
      semester: { not: null },
    },
  });

  assert(
    matkul,
    "Mata kuliah dengan tahun ajaran dan semester harus tersedia"
  );

  // Memastikan tahun ajaran dan semester tidak null
  if (matkul.tahunAjaran === null || matkul.semester === null) {
    throw new Error(
      "Tahun ajaran dan semester mata kuliah belum diisi"
    );
  }

  const tahunAjaran: string = matkul.tahunAjaran;
  const semester: string = matkul.semester;

  // Membuat data pengujian
  const testPertemuan = 999;

  // Memastikan data pengujian belum ada agar tidak mengubah data lama
  const existing = await prisma.rekapMateri.findUnique({
    where: {
      mataKuliahId_tahunAjaran_semester_pertemuan: {
        mataKuliahId: matkul.id,
        tahunAjaran,
        semester,
        pertemuan: testPertemuan,
      },
    },
  });

  if (existing) {
    throw new Error(
      "Data pengujian pertemuan 999 sudah ada. Hapus atau gunakan nomor lain."
    );
  }

  // Create test rekap materi
  const created = await prisma.rekapMateri.create({
    data: {
      mataKuliahId: matkul.id,
      dosenEmail: matkul.dosenEmail,
      tahunAjaran,
      semester,
      pertemuan: testPertemuan,
      materi: "Self check test materi",
      tugas: "Self check tugas",
    },
  });

  assert.strictEqual(created.pertemuan, testPertemuan);

  // Update test rekap materi
  const updated = await prisma.rekapMateri.update({
    where: { id: created.id },
    data: {
      materi: "Updated self check materi",
    },
  });

  assert.strictEqual(
    updated.materi,
    "Updated self check materi"
  );

  // Cleanup test record
  await prisma.rekapMateri.delete({
    where: { id: created.id },
  });

  const deleted = await prisma.rekapMateri.findUnique({
    where: { id: created.id },
  });

  assert.strictEqual(
    deleted,
    null,
    "Record should be deleted"
  );

  console.log("RekapMateri CRUD check passed.");
}

check()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
