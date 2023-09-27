import type { ReactNode } from "react";
import Navbar from "./navbar";
import Head from "next/head";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <Head>
        <title>אפלקציית מעקב שתיות</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex min-h-screen select-none flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
      </div>
    </>
  );
}
