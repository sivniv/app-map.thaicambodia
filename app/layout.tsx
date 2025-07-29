import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import PageTranslator from "@/components/PageTranslator";

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
        <LanguageProvider>
          <PageTranslator>
            {children}
          </PageTranslator>
        </LanguageProvider>
      </body>
    </html>
  );
}