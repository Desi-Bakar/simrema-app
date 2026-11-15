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




import assert from "node:assert/strict";
import { prisma } from "../app/lib/prisma";

async function check() {
  let createdId: string | null = null;

  try {
    // 1. Memastikan admin tersedia
    const admin = await prisma.user.findFirst({
      where: { role: "ADMIN" },
    });

    assert(admin, "Admin user must exist");

    // 2. Mengambil data mata kuliah
    const matkul = await prisma.mataKuliah.findFirst();

    assert(matkul, "At least one mata kuliah must exist");

    // 3. Menyiapkan data pengujian
    const tahunAjaran = matkul.tahunAjaran ?? "SELF-CHECK";
    const semester = matkul.semester ?? "SELF-CHECK";

    // Nomor pertemuan acak agar tidak bentrok dengan data lain
    const testPertemuan =
      900000 + Math.floor(Math.random() * 100000);

    // 4. CREATE - Membuat data rekap materi
    const created = await prisma.rekapMateri.create({
      data: {
        mataKuliahId: matkul.id,
        dosenEmail: matkul.dosenEmail,
        tahunAjaran,
        semester,
        pertemuan: testPertemuan,
        materi: "Self check test materi",
        tugas: "Self check test tugas",
      },
    });

    createdId = created.id;

    assert.strictEqual(created.pertemuan, testPertemuan);

    console.log("CREATE: Berhasil");

    // 5. READ - Membaca data rekap materi
    const found = await prisma.rekapMateri.findUnique({
      where: { id: created.id },
    });

    assert(found, "Rekap materi must exist");
    assert.strictEqual(found.materi, "Self check test materi");

    console.log("READ: Berhasil");

    // 6. UPDATE - Memperbarui data rekap materi
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

    console.log("UPDATE: Berhasil");

    // 7. DELETE - Menghapus data pengujian
    await prisma.rekapMateri.delete({
      where: { id: created.id },
    });

    createdId = null;

    // 8. Memastikan data sudah terhapus
    const deleted = await prisma.rekapMateri.findUnique({
      where: { id: created.id },
    });

    assert.strictEqual(
      deleted,
      null,
      "Record should be deleted"
    );

    console.log("DELETE: Berhasil");

    console.log("--------------------------------");
    console.log("SELF CHECK REKAP MATERI BERHASIL");
    console.log("--------------------------------");
    console.log("Mata Kuliah :", matkul.nama);
    console.log("Tahun Ajaran:", tahunAjaran);
    console.log("Semester    :", semester);
    console.log("Pertemuan   :", testPertemuan);
    console.log("--------------------------------");

  } finally {
    // Membersihkan data jika pengujian gagal di tengah jalan
    if (createdId) {
      await prisma.rekapMateri.deleteMany({
        where: { id: createdId },
      });
    }
  }
}

check()
  .catch((error) => {
    console.error("SELF CHECK GAGAL:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
