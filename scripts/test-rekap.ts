import assert from "node:assert";
import { prisma } from "../app/lib/prisma";

async function check() {
  const admin = await prisma.user.findFirst({ where: { role: "ADMIN" } });
  assert(admin, "Admin user must exist");

  const matkul = await prisma.mataKuliah.findFirst();
  assert(matkul, "At least one mata kuliah must exist");

  // Create test rekap materi
  const testPertemuan = 999;
  const created = await prisma.rekapMateri.upsert({
    where: {
      mataKuliahId_pertemuan: { mataKuliahId: matkul.id, pertemuan: testPertemuan },
    },
    update: { materi: "Self check test materi", tugas: "Self check tugas" },
    create: {
      mataKuliahId: matkul.id,
      dosenEmail: matkul.dosenEmail,
      pertemuan: testPertemuan,
      materi: "Self check test materi",
      tugas: "Self check tugas",
    },
  });
  assert.strictEqual(created.pertemuan, testPertemuan);

  // Update test rekap materi
  const updated = await prisma.rekapMateri.update({
    where: { id: created.id },
    data: { materi: "Updated self check materi" },
  });
  assert.strictEqual(updated.materi, "Updated self check materi");

  // Cleanup test record
  await prisma.rekapMateri.delete({ where: { id: created.id } });
  const deleted = await prisma.rekapMateri.findUnique({ where: { id: created.id } });
  assert.strictEqual(deleted, null, "Record should be deleted");

  console.log("RekapMateri CRUD check passed.");
}

check()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
