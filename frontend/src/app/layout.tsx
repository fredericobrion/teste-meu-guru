import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./components/header";
import { AppWrapper } from "../context/context";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Meu Guru Usuários",
  description: "Gerenciamento de usuários da Meu Guru",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body className={inter.className}>
        <main>
          <AppWrapper>
            <Header />
          </AppWrapper>
          <AppWrapper>{children}</AppWrapper>
        </main>
      </body>
    </html>
  );
}
