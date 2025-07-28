import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Thailand-Cambodia Conflict Monitor",
  description: "AI-powered monitoring of Thailand-Cambodia conflict news and government communications",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}