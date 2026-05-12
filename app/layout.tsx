import type { Metadata } from "next";
import "./globals.css";
import LenisProvider from "@/components/LenisProvider";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "StatDoctor, The Locum Marketplace for Australian Doctors",
  description:
    "Australia's 1st locum doctor marketplace. Connect directly with hospitals and clinics. No agencies, no hidden fees, 0% commission.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <LenisProvider>
          <Nav />
          <main className="relative">{children}</main>
          <Footer />
        </LenisProvider>
      </body>
    </html>
  );
}
