import Image from "next/image";
import Link from "next/link";
import Navbar from "../components/navbar";



export default function RegisterPage() {

  const tahunMasehi = new Date().getFullYear()

  const pendaftaranDosen = [
    {
      "id":"namaLengkap",
      "labelInput": "Nama Lengkap",
      "placeholder": "Masukan nama lengkap dosen",
      "inputType": "text"
    },
    {
      "id":"alamatEmail",
      "labelInput": "Email",
      "placeholder": "Masukan alamat email dosen",
      "inputType": "email"
    },
    {
      "id":"nomorNIDN",
      "labelInput": "NIDN",
      "placeholder": "Masukan nomor NIDN dosen",
      "inputType": "number"
    }
  ]

  return (
    <main className="min-h-screen bg-gray-100 flex flex-col">
      
      {/* Navbar */}
      <Navbar />
      {/* Content */}
      <div className="flex flex-1 items-center justify-center">
        <div className="bg-white shadow-md rounded-xl w-[900px] p-8 flex gap-10">
          {/* Form */}
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-6">Daftar Akun</h2>
            <form className="space-y-4">
                {
                  pendaftaranDosen.map((data)  => (
                    <div className="gap-4" key={data.id}>
                      <label className="block text-sm mb-1 text-zinc-500">{data.labelInput}</label>
                      <input
                        id={data.id}
                        type={data.inputType}
                        placeholder={data.placeholder}
                        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                    </div>
                    )
                  )
                }
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
              >
                Daftar
              </button>
            </form>
            <p className="text-sm text-gray-500 mt-4">
              Sudah punya akun?{" "}
              <Link href="/login" className="text-blue-500 font-medium">
                Login
              </Link>
            </p>
          </div>
          {/* Illustration */}
          <div className=" hidden md:block flex-1 flex items-center justify-center">
            <Image
                src="/request.png"
                alt="Illustration"
                width={500}
                height={500}
                className="object-contain"
            />
          </div>
        </div>
      </div>
      {/* Footer */}
      <footer className="text-center text-sm text-gray-500 py-4">
        ©{tahunMasehi} | Aplikasi Rekap Materi Mengajar Dosen.
      </footer>
    </main>
  );
}