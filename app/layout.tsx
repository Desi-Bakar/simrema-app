import type { Metadata } from "next";
import { Instrument_Sans } from "next/font/google";
import "./globals.css";

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SIMREMA - Sistem Rekap Materi Ajar",
  description: "Sistem Rekap Materi Ajar",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className={`${instrumentSans.className} antialiased`}>{children}</body>
    </html>
  );
}

