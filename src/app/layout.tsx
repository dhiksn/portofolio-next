import type { Metadata } from "next";
import "./globals.css";
import CustomCursor from "@/components/CustomCursor";
import SmoothScroll from "@/components/SmoothScroll";
import Preloader from "@/components/Preloader";

export const metadata: Metadata = {
  title: "Andhika Rafi | System Administrator & IT Support - SMK Wikrama Bogor",
  description:
    "Andhika Rafi — Siswa TJKT SMK Wikrama Bogor yang fokus pada jaringan komputer, Linux, dan Cyber Security. Lihat proyek dan sertifikat saya.",
  keywords: [
    "Andhika Rafi",
    "Portfolio IT",
    "TJKT SMK Wikrama Bogor",
    "System Administrator",
    "IT Support",
    "Cyber Security",
  ],
  authors: [{ name: "Andhika Rafi" }],
  icons: {
    icon: [
      { url: "/assets/img/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/assets/img/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/assets/img/favicon.ico",
    apple: "/assets/img/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    title: "Andhika Rafi | SMK Wikrama Bogor",
    description:
      "Andhika Rafi — Siswa TJKT dari SMK Wikrama Bogor yang fokus pada jaringan komputer, Linux, dan Cyber Security.",
    locale: "id_ID",
    siteName: "Andhika Rafi Portfolio",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body className="font-sans antialiased bg-bg text-text">
        <Preloader />
        <CustomCursor />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}