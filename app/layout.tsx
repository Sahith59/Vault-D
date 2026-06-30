import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BoLD Document Vault Lab",
  description: "Standalone BoLD BOLA and IDOR test app using document IDs."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
