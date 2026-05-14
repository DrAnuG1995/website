import type { Metadata } from "next";
import "./globals.css";
import LenisProvider from "@/components/LenisProvider";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/chat/ChatWidget";

export const metadata: Metadata = {
  title: "StatDoctor",
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
          <ChatWidget />
        </LenisProvider>
      </body>
    </html>
  );
}
