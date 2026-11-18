import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Amigo Secreto — Sorteador online",
  description:
    "Crie um amigo secreto, compartilhe o link com os participantes e faça o sorteio online.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <header className="mx-auto w-full max-w-2xl px-4 py-5">
          <Link href="/" className="text-lg font-bold text-red-700">
            🎁 Amigo Secreto
          </Link>
        </header>
        <main className="mx-auto w-full max-w-2xl flex-1 px-4 pb-12">{children}</main>
        <footer className="py-6 text-center text-xs text-stone-500">
          Sorteio aleatório — cada pessoa só vê quem tirou no seu link pessoal.
        </footer>
      </body>
    </html>
  );
}
