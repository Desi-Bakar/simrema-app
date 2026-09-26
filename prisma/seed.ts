import { prisma } from "../app/lib/prisma";

async function main() {
  console.log("🌱 Menyiapkan data seed awal SIMREMA...");

  // 1. Akun Admin Lengkap
  const adminEmail = "admin@simrema.ac.id";
  const adminPassword = "admin123";

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      password: adminPassword,
      role: "ADMIN",
      status: "APPROVED",
      profilDosen: {
        upsert: {
          create: {
            nama: "Administrator SIMREMA",
            telepon: "081234567890",
            prodi: "Biro Administrasi Akademik",
            alamat: "Kampus Utama SIMREMA, Gedung Rektorat Lt. 1",
            foto: "/profil.png",
          },
          update: {
            nama: "Administrator SIMREMA",
            telepon: "081234567890",
            prodi: "Biro Administrasi Akademik",
            alamat: "Kampus Utama SIMREMA, Gedung Rektorat Lt. 1",
          },
        },
      },
    },
    create: {
      email: adminEmail,
      password: adminPassword,
      role: "ADMIN",
      status: "APPROVED",
      profilDosen: {
        create: {
          nama: "Administrator SIMREMA",
          telepon: "081234567890",
          prodi: "Biro Administrasi Akademik",
          alamat: "Kampus Utama SIMREMA, Gedung Rektorat Lt. 1",
          foto: "/profil.png",
        },
      },
    },
    include: {
      profilDosen: true,
    },
  });

  console.log(`✅ Akun Admin berhasil dibuat/diperbarui:`);
  console.log(`   Email: ${admin.email}`);
  console.log(`   Nama: ${admin.profilDosen?.nama}`);
  console.log(`   Role: ${admin.role}`);
  console.log(`   Status: ${admin.status}`);

  // 2. Akun Dosen Aktif (Contoh untuk testing login Dosen)
  const dosenEmail = "dosen@simrema.ac.id";
  const dosenPassword = "dosen123";

  const dosen = await prisma.user.upsert({
    where: { email: dosenEmail },
    update: {
      password: dosenPassword,
      role: "DOSEN",
      status: "APPROVED",
      profilDosen: {
        upsert: {
          create: {
            nama: "Dr. Ir. Budi Santoso, M.Kom.",
            telepon: "081285234904",
            prodi: "Teknik Informatika",
            alamat: "Fakultas Ilmu Komputer, Kampus A",
            foto: "/profil.png",
          },
          update: {
            nama: "Dr. Ir. Budi Santoso, M.Kom.",
            telepon: "081285234904",
            prodi: "Teknik Informatika",
            alamat: "Fakultas Ilmu Komputer, Kampus A",
          },
        },
      },
    },
    create: {
      email: dosenEmail,
      password: dosenPassword,
      role: "DOSEN",
      status: "APPROVED",
      profilDosen: {
        create: {
          nama: "Dr. Ir. Budi Santoso, M.Kom.",
          telepon: "081285234904",
          prodi: "Teknik Informatika",
          alamat: "Fakultas Ilmu Komputer, Kampus A",
          foto: "/profil.png",
        },
      },
    },
    include: {
      profilDosen: true,
    },
  });

  console.log(`✅ Akun Dosen Aktif berhasil dibuat/diperbarui:`);
  console.log(`   Email: ${dosen.email}`);
  console.log(`   Nama: ${dosen.profilDosen?.nama}`);

  // 3. Akun Dosen PENDING (Contoh permohonan akses baru untuk dites ACC oleh Admin)
  const pendingEmail = "shazilmedina@aretacollege.ac.id";
  const pendingDosen = await prisma.user.upsert({
    where: { email: pendingEmail },
    update: {
      status: "PENDING",
      profilDosen: {
        upsert: {
          create: {
            nama: "Shazil Medina, S.Kom., M.T.",
            telepon: "081298765432",
            prodi: "Sistem Informasi",
            alamat: "Kampus Areta College",
            foto: "/profil.png",
          },
          update: {
            nama: "Shazil Medina, S.Kom., M.T.",
            telepon: "081298765432",
            prodi: "Sistem Informasi",
            alamat: "Kampus Areta College",
          },
        },
      },
    },
    create: {
      email: pendingEmail,
      password: null,
      role: "DOSEN",
      status: "PENDING",
      profilDosen: {
        create: {
          nama: "Shazil Medina, S.Kom., M.T.",
          telepon: "081298765432",
          prodi: "Sistem Informasi",
          alamat: "Kampus Areta College",
          foto: "/profil.png",
        },
      },
    },
    include: {
      profilDosen: true,
    },
  });

  console.log(`✅ Permohonan Akses Pending berhasil disiapkan untuk pengujian ACC Admin:`);
  console.log(`   Email: ${pendingDosen.email}`);
  console.log(`   Nama: ${pendingDosen.profilDosen?.nama}`);
  console.log(`   Status: ${pendingDosen.status}`);
}

main()
  .catch((e) => {
    console.error("❌ Error saat seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
