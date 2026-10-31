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

  // 4. Data Mata Kuliah & Rekap Materi Dosen
  // Mata Kuliah untuk Budi Santoso (dosen@simrema.ac.id)
  const matkulMikrotik = await prisma.mataKuliah.upsert({
    where: { id: "mk-mikrotik-01" },
    update: {
      nama: "MikroTik",
      kode: "NET-201",
      sks: 3,
      semester: "Ganjil 2025/2026",
      dosenEmail: dosen.email,
    },
    create: {
      id: "mk-mikrotik-01",
      nama: "MikroTik",
      kode: "NET-201",
      sks: 3,
      semester: "Ganjil 2025/2026",
      dosenEmail: dosen.email,
    },
  });

  const matkulCisco = await prisma.mataKuliah.upsert({
    where: { id: "mk-cisco-02" },
    update: {
      nama: "CISCO",
      kode: "NET-301",
      sks: 3,
      semester: "Ganjil 2025/2026",
      dosenEmail: dosen.email,
    },
    create: {
      id: "mk-cisco-02",
      nama: "CISCO",
      kode: "NET-301",
      sks: 3,
      semester: "Ganjil 2025/2026",
      dosenEmail: dosen.email,
    },
  });

  const matkulLinux = await prisma.mataKuliah.upsert({
    where: { id: "mk-linux-03" },
    update: {
      nama: "Linux Server",
      kode: "SYS-101",
      sks: 3,
      semester: "Ganjil 2025/2026",
      dosenEmail: dosen.email,
    },
    create: {
      id: "mk-linux-03",
      nama: "Linux Server",
      kode: "SYS-101",
      sks: 3,
      semester: "Ganjil 2025/2026",
      dosenEmail: dosen.email,
    },
  });

  const matkulDocker = await prisma.mataKuliah.upsert({
    where: { id: "mk-docker-04" },
    update: {
      nama: "Docker",
      kode: "SYS-201",
      sks: 3,
      semester: "Ganjil 2025/2026",
      dosenEmail: dosen.email,
    },
    create: {
      id: "mk-docker-04",
      nama: "Docker",
      kode: "SYS-201",
      sks: 3,
      semester: "Ganjil 2025/2026",
      dosenEmail: dosen.email,
    },
  });

  const matkulPython = await prisma.mataKuliah.upsert({
    where: { id: "mk-python-05" },
    update: {
      nama: "Python",
      kode: "PROG-102",
      sks: 3,
      semester: "Ganjil 2025/2026",
      dosenEmail: dosen.email,
    },
    create: {
      id: "mk-python-05",
      nama: "Python",
      kode: "PROG-102",
      sks: 3,
      semester: "Ganjil 2025/2026",
      dosenEmail: dosen.email,
    },
  });

  // Seed 7 rekap materi sesuai tampilan
  await prisma.rekapMateri.deleteMany({});
  const initialDate = new Date("2026-01-01T00:00:00.000Z");

  const sampleRekaps = [
    { matkulId: matkulMikrotik.id, pertemuan: 3, materi: "IP Address", tugas: "Konfigurasi IP Static" },
    { matkulId: matkulCisco.id, pertemuan: 6, materi: "Routing", tugas: "Dynamic Routing OSPF" },
    { matkulId: matkulLinux.id, pertemuan: 9, materi: "Perintah Dasar CLI", tugas: "Manajemen User & File Permission" },
    { matkulId: matkulDocker.id, pertemuan: 4, materi: "Container", tugas: "Build Custom Dockerfile" },
    { matkulId: matkulPython.id, pertemuan: 6, materi: "Library Kunci", tugas: "Eksplorasi Modul Standard" },
    { matkulId: matkulDocker.id, pertemuan: 5, materi: "Docker Compose", tugas: "Deploy Multi-container App" },
    { matkulId: matkulPython.id, pertemuan: 7, materi: "Library Pandas", tugas: "Analisis Dataset CSV" },
  ];

  for (const item of sampleRekaps) {
    await prisma.rekapMateri.create({
      data: {
        mataKuliahId: item.matkulId,
        dosenEmail: dosen.email,
        pertemuan: item.pertemuan,
        tanggal: initialDate,
        materi: item.materi,
        tugas: item.tugas,
      },
    });
  }

  console.log(`✅ 7 Data Rekap Materi awal berhasil disiapkan sesuai desain.`);

  console.log(`✅ Mata Kuliah awal berhasil disiapkan dan di-assign ke dosen:`);
  console.log(`   - ${matkulMikrotik.nama} (Dosen: ${dosen.email})`);
  console.log(`   - ${matkulCisco.nama} (Dosen: ${dosen.email})`);
  console.log(`   - ${matkulLinux.nama} (Dosen: ${dosen.email})`);
}

main()
  .catch((e) => {
    console.error("❌ Error saat seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
