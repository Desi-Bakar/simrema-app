import { prisma } from "../app/lib/prisma";

async function checkAllQueries() {
  console.log("Checking all Prisma queries...");
  const errors: Array<{ name: string; error: string }> = [];

  // Query 1: User count & findMany
  try {
    const users = await prisma.user.findMany({
      include: { profilDosen: true },
      orderBy: { createdAt: "desc" },
    });
    console.log(`[OK] User.findMany: ${users.length} records`);
  } catch (e) {
    errors.push({ name: "User.findMany", error: String(e) });
  }

  // Query 2: MataKuliah with dosen & rekap count
  try {
    const matkuls = await prisma.mataKuliah.findMany({
      include: {
        dosen: {
          select: {
            email: true,
            profilDosen: { select: { nama: true } },
          },
        },
        _count: { select: { rekapMateri: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    console.log(`[OK] MataKuliah.findMany: ${matkuls.length} records`);
  } catch (e) {
    errors.push({ name: "MataKuliah.findMany", error: String(e) });
  }

  // Query 3: RekapMateri with matkul & dosen
  try {
    const rekaps = await prisma.rekapMateri.findMany({
      include: {
        mataKuliah: { select: { id: true, nama: true, kode: true, dosenEmail: true } },
        dosen: { select: { email: true, profilDosen: { select: { nama: true } } } },
      },
      orderBy: [{ tanggal: "desc" }, { pertemuan: "desc" }],
    });
    console.log(`[OK] RekapMateri.findMany: ${rekaps.length} records`);
  } catch (e) {
    errors.push({ name: "RekapMateri.findMany", error: String(e) });
  }

  // Query 4: ProfilDosen
  try {
    const profils = await prisma.profilDosen.findMany();
    console.log(`[OK] ProfilDosen.findMany: ${profils.length} records`);
  } catch (e) {
    errors.push({ name: "ProfilDosen.findMany", error: String(e) });
  }

  // Query 5: Insensitive search query (used in POST /api/materi)
  try {
    const search = await prisma.mataKuliah.findFirst({
      where: { nama: { equals: "mikrotik", mode: "insensitive" } },
    });
    console.log(`[OK] MataKuliah case-insensitive search: ${search ? search.nama : "not found"}`);
  } catch (e) {
    errors.push({ name: "MataKuliah insensitive search", error: String(e) });
  }

  // Query 6: Raw query ping
  try {
    const ping = await prisma.$queryRaw`SELECT 1 as result`;
    console.log(`[OK] Raw ping query:`, ping);
  } catch (e) {
    errors.push({ name: "Raw ping", error: String(e) });
  }

  if (errors.length > 0) {
    console.error("\nFound errors in queries:");
    for (const err of errors) {
      console.error(`- ${err.name}: ${err.error}`);
    }
    process.exit(1);
  } else {
    console.log("\nAll queries executed with 0 errors.");
  }
}

checkAllQueries()
  .catch((e) => {
    console.error("Fatal:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
