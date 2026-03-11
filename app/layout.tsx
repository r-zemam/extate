import type { Metadata } from "next";
import { Inter } from "next/font/google";
import BrowserCompatibilityWarning from "@/components/BrowserCompatibilityWarning";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EXTATE - Document Protection Platform",
  description: "Cryptographic proof of property ownership for families in developing countries",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <BrowserCompatibilityWarning />
        {children}
      </body>
    </html>
  );
}
