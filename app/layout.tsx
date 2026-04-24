import type { Metadata } from "next";
import "./globals.css";
import LenisProvider from "@/components/LenisProvider";
import Cursor from "@/components/Cursor";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Mascot from "@/components/Mascot";

export const metadata: Metadata = {
  title: "StatDoctor — The Locum Marketplace for Australian Doctors",
  description:
    "Australia's 1st locum doctor marketplace. Connect directly with hospitals and clinics. No agencies, no hidden fees, 0% commission.",
  icons: {
    icon: "https://cdn.prod.website-files.com/688db6d677516719c3925d01/6890a03498323d7b7c29d34e_statdoc_logo.svg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <LenisProvider>
          <Cursor />
          <Nav />
          <Mascot />
          <main className="relative z-[2]">{children}</main>
          <Footer />
        </LenisProvider>
      </body>
    </html>
  );
}
